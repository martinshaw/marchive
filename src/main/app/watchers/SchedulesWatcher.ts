/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: schedules.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import logger from "../../log"
import { retrieveDueSchedules } from "../repositories/ScheduleRepository"
import performCaptureRun from "../repositories/CaptureRunRepository"

const SchedulesWatcher = async (): Promise<void | never> => {
  const currentDelayBetweenTicks = (60 * 1000) * 1 // 1 minute

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await tick()
    } catch (error) {
      //
    }

    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => {
      setTimeout(() => resolve(null), currentDelayBetweenTicks)
    })
  }
}

const tick = async (): Promise<void> => {
  const dueSchedules = await retrieveDueSchedules()

  if (dueSchedules.length === 0) logger.error('No Schedules due to be run')

  dueSchedules.forEach(async schedule => {
    logger.info(`Found Schedule ${schedule.id} due to be run`)

    try {
      performCaptureRun(schedule)
    } catch (error) {
      //
    }
  })
}

export default SchedulesWatcher
