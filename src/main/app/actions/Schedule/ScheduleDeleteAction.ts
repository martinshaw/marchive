/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import logger from '../../../log'
import {Schedule, Source} from '../../../database'

/**
 * @throws {Error}
 */
const ScheduleDeleteAction = async (scheduleId: number): Promise<void> => {
  const originalSchedule = await Schedule.findByPk(scheduleId, {include: [Source]})

  if (originalSchedule == null) {
    const errorMessage = 'No Schedule found with that ID'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (originalSchedule.captures?.length > 0) {
    const errorMessage = 'The Schedule has associated Captures and cannot be deleted'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  logger.info('Deleting Schedule with ID ' + originalSchedule.id)

  await originalSchedule.destroy()

  const scheduleCheck = await Schedule.findByPk(originalSchedule.id)
  if (scheduleCheck != null) {
    const errorMessage = 'The Schedule could not be deleted'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export default ScheduleDeleteAction
