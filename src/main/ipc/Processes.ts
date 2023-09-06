/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Processes.ts
Created:  2023-09-06T17:02:56.185Z
Modified: 2023-09-06T17:02:56.185Z

Description: description
*/

import { ipcMain } from 'electron'
import ProcessStartProcess from '../app/actions/Process/ProcessStartProcess'
import logger from '../app/log'

export type ProcessesChannels =
  | 'processes.start-schedule-run-process'
  | 'processes.start-capture-part-run-process'

export type ProcessesReplyOngoingEventDataType = {
  origin: 'stderr' | 'stdout' | null;
  event: 'close' | 'data' | 'end' | 'error' | 'pause' | 'readable' | 'resume' | 'exit' | 'message' | 'disconnect' | 'spawn';
  data: any | null;
}

ipcMain.on('processes.start-schedule-run-process', async (event) => {
  return ProcessStartProcess(
    'ScheduleRunProcess',
    (childProcess) => {
      childProcess.stderr?.on('data', (data) => {
        logger.info('ScheduleRunProcess: stderr data: ', {data})
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'data',
          data,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('data', (data) => {
        logger.info('ScheduleRunProcess: stdout data: ', {data})
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'data',
          data,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stderr?.on('close', () => {
        logger.info('ScheduleRunProcess: stderr close')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'close',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('close', () => {
        logger.info('ScheduleRunProcess: stdout close')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'close',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stderr?.on('end', () => {
        logger.info('ScheduleRunProcess: stderr end')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'end',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('end', () => {
        logger.info('ScheduleRunProcess: stdout end')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'end',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stderr?.on('error', (error) => {
        logger.error('ScheduleRunProcess: stderr error')
        logger.error(error)
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'error',
          data: error,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('error', (error) => {
        logger.error('ScheduleRunProcess: stdout error')
        logger.error(error)
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'error',
          data: error,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stderr?.on('pause', () => {
        logger.info('ScheduleRunProcess: stderr pause')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'pause',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('pause', () => {
        logger.info('ScheduleRunProcess: stdout pause')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'pause',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stderr?.on('readable', () => {
        logger.info('ScheduleRunProcess: stderr readable')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'readable',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('readable', () => {
        logger.info('ScheduleRunProcess: stdout readable')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'readable',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stderr?.on('resume', () => {
        logger.info('ScheduleRunProcess: stderr resume')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stderr',
          event: 'resume',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.stdout?.on('resume', () => {
        logger.info('ScheduleRunProcess: stdout resume')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: 'stdout',
          event: 'resume',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.on('close', (exitCode) => {
        logger.info('ScheduleRunProcess: close: ', {exitCode})
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: null,
          event: 'close',
          data: exitCode,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.on('error', (error) => {
        logger.error('ScheduleRunProcess: error')
        logger.error(error)
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: null,
          event: 'error',
          data: error,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.on('exit', (exitCode) => {
        logger.info('ScheduleRunProcess: exit: ', {exitCode})
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: null,
          event: 'exit',
          data: exitCode,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.on('message', (message) => {
        logger.info('ScheduleRunProcess: message: ', {message})
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: null,
          event: 'message',
          data: message,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.on('disconnect', () => {
        logger.info('ScheduleRunProcess: disconnect')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: null,
          event: 'disconnect',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })

      childProcess.on('spawn', () => {
        logger.info('ScheduleRunProcess: spawn')
        event.reply('processes.start-schedule-run-process', null, null, {
          origin: null,
          event: 'spawn',
          data: null,
        } as ProcessesReplyOngoingEventDataType)
      })
    }
  )
    .then(connectionInfo => { event.reply('processes.start-schedule-run-process', connectionInfo, null, null) })
    .catch(error => { event.reply('processes.start-schedule-run-process', null, error, null) })
})

// ipcMain.on('processes.start-capture-part-run-process', async (event) => {
//   return ProcessStartProcess(
//     'CapturePartRunProcess',
//     (childProcess) => {
//       //
//     }
//   )
//   .then(connectionInfo => { event.reply('processes.start-capture-part-run-process', connectionInfo, null, null) })
//   .catch(error => { event.reply('processes.start-capture-part-run-process', null, error, null) })
// })
