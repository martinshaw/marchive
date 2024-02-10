/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleCreate.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/
import fs from "node:fs";
import path from "node:path";
import {
  AllowedScheduleIntervalReturnType,
  getDataProviderByIdentifier,
} from "data-providers";
import logger from "logger";
import commander, { Command } from "commander";
import { Schedule, Source } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";
import { safeSanitizeFileName, userDownloadsCapturesPath } from "utilities";
import dayjs from "dayjs";

const ScheduleCreate = new commander.Command("schedule:create");

ScheduleCreate.description("Create a new Schedule")
  .argument("<source-id>", "Source ID")
  .option(
    `--interval-in-seconds <interval-in-seconds>`,
    "Interval in Seconds (default: does not repeat) (e.g. one hour = 3600, one day = 86400, two days = 172800, one week = 604800, two weeks = 1209600, monthly = 2592000, two months = 5184000, yearly = 31536000, monthly = 2592000)",
  )
  .option(
    `--download-location <download-location>`,
    "Download location (default: same as Source's download location)",
  )
  .action(
    async (
      sourceId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
      program: Command,
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        let intervalInSeconds: number | null =
          optionsAndArguments?.intervalInSeconds == null
            ? null
            : parseInt(optionsAndArguments?.intervalInSeconds + "");

        let downloadLocation: string | null =
          optionsAndArguments?.downloadLocation?.toString() ?? null;

        let source: Source | null = null;
        try {
          source = await Source.findOne({ where: { id: parseInt(sourceId) } });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to find Source ID ${sourceId} for new Schedule`,
            error instanceof Error ? error : null,
          );
        }

        if (source == null)
          throw new ErrorResponse(`No source found with id: ${sourceId}`);

        const dataProvider = await getDataProviderByIdentifier(
          source.dataProviderIdentifier,
        );
        if (dataProvider == null)
          throw new ErrorResponse(
            "No installed Data Provider could be found for the Source's Data Provider identifier: " +
              (source.dataProviderIdentifier ?? ""),
          );

        const dataProviderAllowedIntervalInformation: AllowedScheduleIntervalReturnType =
          await dataProvider.allowedScheduleInterval();
        const minimumNonNullIntervalInSeconds = 5 * 60; // 5 minutes

        if (
          dataProviderAllowedIntervalInformation.onlyRunOnce === true ||
          intervalInSeconds == null
        ) {
          logger.info(
            `The Source's Data Provider '${dataProvider.getName()}' will only allow this new Schedule to be ran once by the schedule watcher...`,
          );
          intervalInSeconds = null;
        } else if (intervalInSeconds < minimumNonNullIntervalInSeconds) {
          logger.info(
            `Attempting to create a new Schedule with an interval below the minimum allowed (${minimumNonNullIntervalInSeconds} seconds), using minimum allowed instead...`,
          );
          intervalInSeconds = minimumNonNullIntervalInSeconds;
        }

        const downloadDirectory = safeSanitizeFileName(source.url);
        if (downloadDirectory === false) {
          const errorMessage = "Failed to sanitize download directory name";
          logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        downloadLocation = path.join(
          downloadLocation == null
            ? userDownloadsCapturesPath
            : downloadLocation,
          downloadDirectory,
        );

        logger.info(
          "Using download location: " + downloadLocation + " for new Schedule",
        );

        if (downloadLocation.endsWith("/"))
          downloadLocation = downloadLocation.slice(0, -1);
        if (fs.existsSync(downloadLocation) === false)
          fs.mkdirSync(downloadLocation, { recursive: true });

        if (fs.lstatSync(downloadLocation).isDirectory() === false)
          throw new ErrorResponse(
            `The chosen download destination must be a directory`,
          );

        const nextRunAtDate = dayjs();

        if (intervalInSeconds != null) {
          nextRunAtDate.add(intervalInSeconds, "second");
        }

        const nextRunAtDateAsString = nextRunAtDate.format(
          "YYYY-MM-DD HH:mm:ss",
        );

        let schedule: Schedule | null = null;
        try {
          schedule = await Schedule.save({
            interval: intervalInSeconds,
            nextRunAt: nextRunAtDateAsString,
            downloadLocation: downloadLocation,
            sourceId: source.id,
          });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to create a new Schedule for Source ID ${source.id}`,
            error instanceof Error ? error : null,
          );
        }

        if (schedule == null)
          throw new ErrorResponse(`Failed to create new Schedule`);

        return new MessageResponse(
          `Created new Schedule with ID ${schedule.id}`,
          [schedule],
        ).send();
      });
    },
  );

export default ScheduleCreate;
