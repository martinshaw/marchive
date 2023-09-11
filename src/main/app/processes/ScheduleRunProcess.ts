/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleRunProcess.ts
Created:  2023-09-06T04:58:02.055Z
Modified: 2023-09-06T04:58:02.055Z

Description: description
*/
import logger from '../log'
import { retrieveDueSchedules } from "../repositories/ScheduleRepository"
import performCaptureRun from "../repositories/CaptureRunRepository"
import process from 'node:process'

const ScheduleRunProcess = async (): Promise<void | never> => {
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

  if (dueSchedules.length === 0) console.info('No Schedules due to be run')

  dueSchedules.forEach(async schedule => {
    console.info(`Found Schedule ${schedule.id} due to be run`)

    performCaptureRun(schedule)
      .catch(error => {
        console.error(`Error running Schedule ID ${schedule.id} in ScheduleRunProcess tick loop`)
        console.error(error)
      })
  })
}

ScheduleRunProcess()
