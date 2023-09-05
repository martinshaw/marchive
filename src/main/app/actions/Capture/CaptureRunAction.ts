/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureRunAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { Schedule } from '../../../database'
import performCaptureRun from '../../repositories/CaptureRunRepository'
import logger from '../../../log'

/**
 * @throws {Error}
 */
const CaptureRunAction = async (scheduleId: number): Promise<void | never> => {
  const schedule = await Schedule.findByPk(scheduleId)
  if (schedule == null) {
    const errorMessage = `No schedule found with id: ${scheduleId}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  performCaptureRun(schedule)
}

export default CaptureRunAction
