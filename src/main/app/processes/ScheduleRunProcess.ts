/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleRunProcess.ts
Created:  2023-09-06T04:58:02.055Z
Modified: 2023-09-06T04:58:02.055Z

Description: description
*/
import logger from '../log'
import process from 'node:process'
import { Schedule } from '../../database'
import performCaptureRun from "../repositories/CaptureRunRepository"
import { retrieveDueSchedules } from "../repositories/ScheduleRepository"
import { getStoredSettingValue } from '../repositories/StoredSettingRepository'
import { ScheduleStatus } from '../../database/models/Schedule'

let lastSchedule: Schedule | null = null;

const ScheduleRunProcess = async (): Promise<void | never> => {
  // const currentDelayBetweenTicks = (60 * 1000) * 1 // 1 minute
  const currentDelayBetweenTicks = 15 * 1000 // 15 seconds

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let scheduleRunProcessIsPaused = await getStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED') === true

    try {
      // eslint-disable-next-line no-await-in-loop
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

    // eslint-disable-next-line no-await-in-loop
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
