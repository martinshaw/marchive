/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import logger from 'logger';
import { Schedule } from 'database';

/**
 * @throws {Error}
 */
const ScheduleDeleteAction = async (scheduleId: number): Promise<void> => {
  let originalSchedule: Schedule | null = null;
  try {
    originalSchedule = await Schedule.findOne({
      where: { id: scheduleId },
      relations: { source: true },
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to find Schedule ID  ${scheduleId} for deletion`,
    );
    logger.error(error);
  }

  if (originalSchedule == null) {
    const errorMessage = 'No Schedule found with that ID';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (originalSchedule.captures?.length > 0) {
    const errorMessage =
      'The Schedule has associated Captures and cannot be deleted';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Deleting Schedule with ID ' + originalSchedule.id);

  await originalSchedule.softRemove();

  let scheduleCheck: Schedule | null = null;
  try {
    scheduleCheck = await Schedule.findOne({
      where: { id: originalSchedule.id },
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to find Schedule ID ${scheduleId} to be check successful deletion`,
    );
    logger.error(error);
  }

  if (scheduleCheck != null) {
    const errorMessage = 'The Schedule could not be deleted';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export default ScheduleDeleteAction;
