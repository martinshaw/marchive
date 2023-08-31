/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: utilities.ts
Created:  2023-08-01T20:04:09.893Z
Modified: 2023-08-01T20:04:09.893Z

Description: description
*/

import { ipcMain, nativeTheme } from 'electron';

export type UtilitiesChannels =
  | 'utilities.is-dark-mode'

// ipcMain.on('utilities.ipc-example', async (event /* , arg */) => {
//   event.reply('utilities.ipc-example', 'pong');
// });

ipcMain.on('utilities.is-dark-mode', async (event) => {
  event.reply('utilities.is-dark-mode', nativeTheme.shouldUseDarkColors);
});
