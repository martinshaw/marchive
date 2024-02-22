/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Watchers.ts
Created:  2023-09-06T17:02:56.185Z
Modified: 2023-09-06T17:02:56.185Z

Description: description
*/

import { ipcMain } from 'electron';
import runPerpetualCliCommand from '../app/cli/runPerpetualCliCommand';

export type WatchersChannels =
  // for watch:schedules CLI sub-command
  | 'watchers.schedules.start'
  | 'watchers.schedules.ongoing-stdout'
  | 'watchers.schedules.ongoing-stderr'
  | 'watchers.schedules.ongoing-message'
  | 'watchers.schedules.connected'
  | 'watchers.schedules.disconnected'
  // for watch:capture-parts CLI sub-command
  | 'watchers.capture-parts.start'
  | 'watchers.capture-parts.ongoing-stdout'
  | 'watchers.capture-parts.ongoing-stderr'
  | 'watchers.capture-parts.ongoing-message'
  | 'watchers.capture-parts.connected'
  | 'watchers.capture-parts.disconnected';

ipcMain.on('watchers.schedules.start', async (event) => {
  runPerpetualCliCommand(
    'watch:schedules',
    [],
    {},
    (data) => {
      event.reply('watchers.schedules.ongoing-stdout', data);
    },
    (data) => {
      event.reply('watchers.schedules.ongoing-stderr', data);
    },
    (message) => {
      event.reply('watchers.schedules.ongoing-message', message);
    },
    (code) => {
      event.reply('watchers.schedules.disconnected', code);
    },
    (childProcess) => {
      event.reply('watchers.schedules.connected', childProcess.pid);
    },
  );
});

ipcMain.on('watchers.capture-parts.start', async (event) => {
  runPerpetualCliCommand(
    'watch:capture-parts',
    [],
    {},
    (data) => {
      event.reply('watchers.capture-parts.ongoing-stdout', data);
    },
    (data) => {
      event.reply('watchers.capture-parts.ongoing-stderr', data);
    },
    (message) => {
      event.reply('watchers.capture-parts.ongoing-message', message);
    },
    (code) => {
      event.reply('watchers.capture-parts.disconnected', code);
    },
    (childProcess) => {
      event.reply('watchers.capture-parts.connected', childProcess.pid);
    },
  );
});
