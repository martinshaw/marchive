/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-11T02:59:44.724Z
Modified: 2023-10-11T02:59:44.724Z

Description: description
*/

import logger from "logger";
import commander from "commander";
import {
  getStoredSettingValue,
  CapturePart,
  Schedule,
  retrieveDueCapturePart,
} from "database";
import { getDataProviderByIdentifier } from "data-providers";
import BaseDataProvider from "data-providers/src/BaseDataProvider";

let lastCapturePart: CapturePart | null = null;

let WatchCaptureParts = new commander.Command("watch:capture-parts")
  .description("Watch for pending Capture Parts to be processed")
  .action(
    async (optionsAndArguments: {
      [key: string]: string | number | boolean;
    }) => {
      process.once("beforeExit", async () => {
        const capturePartsProcessing = await CapturePart.find({
          where: {
            status: "processing",
          },
        });

        for (let i = 0; i < capturePartsProcessing.length; i++) {
          await cleanup(capturePartsProcessing[i]);
        }

        process.exit(0);
      });

      // Should wait for 6 seconds between ticks when downloading pending files
      // When there are no pending files to download, should wait for 60 seconds between ticks
      let currentDelayBetweenTicks = 6 * 1000;

      while (true) {
        // TODO: May need to remove await, then use the returned values to set the currentDelayBetweenTicks asynchronously

        let watchCapturePartsProcessIsPaused =
          (await getStoredSettingValue(
            "WATCH_CAPTURE_PARTS_PROCESS_IS_PAUSED",
          )) === true;

        try {
          if (watchCapturePartsProcessIsPaused === false) {
            const { processedSuccessfully, hadPendingCapturePart } =
              await tick();

            currentDelayBetweenTicks =
              hadPendingCapturePart === false ? 60 * 1000 : 6 * 1000;
          }
        } catch (error) {
          if (lastCapturePart != null) {
            logger.error(
              `An error occurred when trying to process Capture Part ${lastCapturePart.id} ${lastCapturePart.url}`,
            );
            logger.error(error);

            lastCapturePart.status = "failed";
            await lastCapturePart.save();
          }
        }

        await new Promise((resolve) => {
          setTimeout(() => resolve(null), currentDelayBetweenTicks);
        });
      }
    },
  );

const tick = async (): Promise<{
  processedSuccessfully: boolean;
  hadPendingCapturePart: boolean;
}> => {
  logger.info("Looking for pending Capture Parts...");

  let capturePart: CapturePart | null = null;
  try {
    capturePart = await retrieveDueCapturePart();
  } catch (error) {
    logger.error(
      "A DB error occurred when trying to find a pending Capture Part for processing",
    );
    logger.error(error);
  }

  if (capturePart == null) {
    logger.info("No pending Capture Parts found");

    return {
      processedSuccessfully: false,
      hadPendingCapturePart: false,
    };
  }

  logger.info(
    `Found a pending Capture Part to be downloaded: ${capturePart?.id} ${capturePart?.url}`,
  );

  if (capturePart?.capture?.schedule?.source?.dataProviderIdentifier == null) {
    logger.error(
      "No Data Provider Identifier found for pending Capture's Source",
    );

    return {
      processedSuccessfully: false,
      hadPendingCapturePart: capturePart !== null,
    };
  }

  const dataProvider = await getDataProviderByIdentifier(
    capturePart.capture?.schedule?.source?.dataProviderIdentifier,
  );
  if (dataProvider == null) {
    logger.error("No Data Provider found for pending Capture's Source");

    return {
      processedSuccessfully: false,
      hadPendingCapturePart: capturePart !== null,
    };
  }

  const processedSuccessfully = await processPart(capturePart, dataProvider);

  return {
    processedSuccessfully,
    hadPendingCapturePart: capturePart !== null,
  };
};

const processPart = async (
  capturePart: CapturePart,
  dataProvider: BaseDataProvider,
): Promise<boolean> => {
  lastCapturePart = capturePart;

  // let schedule: Schedule | undefined = capturePart.capture?.schedule;
  // if (schedule != null) {
  //   schedule.status = "processing";
  //   await schedule.save();
  // }

  capturePart.status = "processing";
  await capturePart.save();

  logger.info(
    `Processing Capture Part ${capturePart.id} ${capturePart.url}...`,
  );

  let processRanSuccessfully: boolean;
  let processError: Error | null = null;
  try {
    processRanSuccessfully = await dataProvider.processPart(capturePart);
  } catch (error) {
    processRanSuccessfully = false;
    processError = error as Error;
  }

  if (!processRanSuccessfully || processError != null) {
    logger.error(
      `Failed to process Capture Part ${capturePart.id} ${capturePart.url}...`,
    );
    logger.error(processError);

    capturePart.status = "failed";
    capturePart.currentRetryCount += 1;
    await capturePart.save();

    // schedule = capturePart.capture?.schedule;
    // if (schedule != null) {
    //   schedule.status = "pending";
    //   await schedule.save();
    // }

    return false;
  }

  logger.info(`Successfully Processed Capture Part ${capturePart.id}...`);

  capturePart.status = "completed";
  capturePart.currentRetryCount += 1;
  await capturePart.save();

  // schedule = capturePart.capture?.schedule;
  // if (schedule != null) {
  //   schedule.status = "pending";
  //   await schedule.save();
  // }

  return true;
};

const cleanup = async (
  capturePart: CapturePart | null | undefined,
): Promise<CapturePart | undefined> => {
  if (capturePart == null) return undefined;

  capturePart.status = "pending";

  await capturePart.save();

  // const schedule = capturePart.capture?.schedule;
  // if (schedule == null) return undefined;

  // schedule.status = "pending";
  // await schedule.save();
};

export default WatchCaptureParts;
