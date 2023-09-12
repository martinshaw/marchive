/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Utilities.ts
Created:  2023-08-01T20:04:09.893Z
Modified: 2023-08-01T20:04:09.893Z

Description: description
*/

import { ipcMain, nativeTheme, shell } from 'electron';
import { getStoredSettingValue, setStoredSettingValue } from '../app/repositories/StoredSettingRepository';
import { sequelize } from '../database';

export type UtilitiesChannels =
  | 'utilities.is-dark-mode'
  | 'utilities.marchive-is-setup'
  | 'utilities.open-external-url-in-browser'

ipcMain.on('utilities.is-dark-mode', async (event) => {
  event.reply('utilities.is-dark-mode', nativeTheme.shouldUseDarkColors);
})

ipcMain.on('utilities.marchive-is-setup', async (event, newValue) => {
  if (newValue != null) await setStoredSettingValue('MARCHIVE_IS_SETUP', newValue);
  event.reply('utilities.marchive-is-setup', (await getStoredSettingValue('MARCHIVE_IS_SETUP') ?? false));
})

ipcMain.on('utilities.open-external-url-in-browser', async (event, url) => {
  if (url == null) return;
  shell.openExternal(url);
})
