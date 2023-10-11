/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-11T02:59:44.724Z
Modified: 2023-10-11T02:59:44.724Z

Description: description
*/

import logger from 'logger';
import 'database'
import { Schedule } from 'database'
import performCaptureRun from "./performCaptureRun"
import { retrieveDueSchedules } from "../repositories/ScheduleRepository"
import { getStoredSettingValue } from '../repositories/StoredSettingRepository'

let lastSchedule: Schedule | null = null;

const ScheduleRunProcess = async (): Promise<void | never> => {
  // const currentDelayBetweenTicks = (60 * 1000) * 1 // 1 minute
  const currentDelayBetweenTicks = 15 * 1000 // 15 seconds

  while (true) {
    let scheduleRunProcessIsPaused = await getStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED') === true

    try {
      if (scheduleRunProcessIsPaused === false) await tick()
    } catch (error) {
      if (lastSchedule != null) {
        logger.error(`An error occurred when trying to process Schedule ${lastSchedule.id} ${lastSchedule}`)
        logger.error(error)

        /**
         * Don't want to update the status of the Schedule to failed, as it may be due to a temporary
         *   issue and we don't want to stop the Schedule from running future captures
         */
        // await lastSchedule.update({status: 'failed' as ScheduleStatus})
      }
    }

    await new Promise(resolve => {
      setTimeout(() => resolve(null), currentDelayBetweenTicks)
    })
  }
}

const tick = async (): Promise<void> => {
  const dueSchedules = await retrieveDueSchedules()

  if (dueSchedules.length === 0) logger.debug('No Schedules due to be run')

  dueSchedules.forEach(async schedule => {
    lastSchedule = schedule

    logger.info(`Found Schedule ${schedule.id} due to be run`)

    performCaptureRun(schedule)
      .catch(error => {
        logger.error(`Error running Schedule ID ${schedule.id} in ScheduleRunProcess tick loop`)
        logger.error(error)
      })
  })
}

ScheduleRunProcess()