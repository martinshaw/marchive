/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Processes.ts
Created:  2023-09-06T17:02:56.185Z
Modified: 2023-09-06T17:02:56.185Z

Description: description
*/

import { ipcMain } from 'electron';

import ProcessStartProcessAction from '../app/actions/Process/ProcessStartProcessAction';

export type ProcessesChannels =
  | 'processes.schedule-run-process.start'
  | 'processes.schedule-run-process.connected'
  | 'processes.schedule-run-process.ongoing-event'
  | 'processes.schedule-run-process.connection-error'

  | 'processes.capture-part-run-process.start'
  | 'processes.capture-part-run-process.connected'
  | 'processes.capture-part-run-process.ongoing-event'
  | 'processes.capture-part-run-process.connection-error';

ipcMain.on('processes.schedule-run-process.start', async (event) => {
  return ProcessStartProcessAction(
    'ScheduleRunProcess',
    'processes.schedule-run-process.connected',
    'processes.schedule-run-process.ongoing-event',
    'processes.schedule-run-process.connection-error',
    (childProcess) => {
      //
    }
  );
});

ipcMain.on('processes.capture-part-run-process.start', async (event) => {
  return ProcessStartProcessAction(
    'CapturePartRunProcess',
    'processes.capture-part-run-process.connected',
    'processes.capture-part-run-process.ongoing-event',
    'processes.capture-part-run-process.connection-error',
    (childProcess) => {
      //
    }
  );
});
