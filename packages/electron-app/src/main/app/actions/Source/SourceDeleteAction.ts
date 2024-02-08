/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import fs from 'node:fs';
import logger from 'logger';
import { rimraf } from 'rimraf';
import { Capture, CapturePart, Source } from 'database';

/**
 * @throws {Error}
 */
const SourceDeleteAction = async (
  sourceId: number,
  alsoDeleteFiles: boolean = false,
): Promise<void> => {
  let originalSource: Source | null = null;
  try {
    originalSource = await Source.findOne({
      where: { id: sourceId },
      relations: { schedules: true },
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to find Source ID ${sourceId} for deletion`,
    );
    logger.error(error);
  }

  if (originalSource == null) {
    const errorMessage = 'No Source found with that ID';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (originalSource.schedules?.length > 0) {
    originalSource.schedules.forEach(async (schedule) => {
      logger.info('Deleting Schedule with ID ' + schedule.id);

      const captures = await Capture.find({
        where: { scheduleId: schedule.id },
      });

      captures.forEach(async (capture) => {
        logger.info('Deleting Capture with ID ' + capture.id);

        const captureParts = await CapturePart.find({
          where: { captureId: capture.id },
        });

        captureParts.forEach(async (capturePart) => {
          logger.info('Deleting Capture Part with ID ' + capturePart.id);

          await capturePart.softRemove();
        });

        await capture.softRemove();
      });

      if (
        alsoDeleteFiles === true &&
        schedule.downloadLocation != null &&
        fs.existsSync(schedule.downloadLocation)
      ) {
        await rimraf(schedule.downloadLocation);
      }

      await schedule.softRemove();
    });
  }

  logger.info('Deleting Source with ID ' + originalSource.id);

  await originalSource.softRemove();

  let sourceCheck: Source | null = null;
  try {
    sourceCheck = await Source.findOne({ where: { id: sourceId } });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to find Source ID ${sourceId} for check successful deletion`,
    );
    logger.error(error);
  }

  if (sourceCheck != null) {
    const errorMessage = 'The Source could not be deleted';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export default SourceDeleteAction;
