/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Watchers.ts
Created:  2023-09-06T17:02:56.185Z
Modified: 2023-09-06T17:02:56.185Z

Description: description
*/

import { ipcMain } from 'electron';

export type WatchersChannels =
  | 'watchers.schedules.start'
  | 'watchers.schedules.connected'
  | 'watchers.schedules.ongoing-event'
  | 'watchers.schedules.connection-error'
  | 'watchers.capture-parts.start'
  | 'watchers.capture-parts.connected'
  | 'watchers.capture-parts.ongoing-event'
  | 'watchers.capture-parts.connection-error';
