/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Utilities.ts
Created:  2023-08-01T20:04:09.893Z
Modified: 2023-08-01T20:04:09.893Z

Description: description
*/

import { Menu, shell, ipcMain, nativeTheme, BrowserWindow } from 'electron';
import { runCliCommandWithImmediateResponse } from '../app/cli/runCliCommand';

const setStoredSettingValue = async (key: string, value: any) =>
  runCliCommandWithImmediateResponse('stored-setting:set', [key, value]).then(
    (response) => {
      if (response.getSuccess()) return response.getData()[0].value;
      return null;
    },
  );

const getStoredSettingValue = async (key: string) =>
  runCliCommandWithImmediateResponse('stored-setting:get', [key]).then(
    (response) => {
      if (response.getSuccess()) return response.getData()[0].value;
      return null;
    },
  );

export type UtilitiesChannels =
  | 'utilities.is-dark-mode'
  | 'utilities.marchive-is-setup'
  | 'utilities.schedule-run-process-is-paused'
  | 'utilities.capture-part-run-process-is-paused'
  | 'utilities.open-external-url-in-browser'
  | 'utilities.open-internal-path-in-default-program'
  | 'utilities.focused-window.toggle-maximize'
  | 'utilities.focused-window.open-application-menu';

ipcMain.on('utilities.is-dark-mode', async (event) => {
  event.reply('utilities.is-dark-mode', nativeTheme.shouldUseDarkColors);
});

ipcMain.on('utilities.marchive-is-setup', async (event, newValue: boolean) => {
  if (newValue != null)
    await setStoredSettingValue('MARCHIVE_IS_SETUP', newValue);
  event.reply(
    'utilities.marchive-is-setup',
    (await getStoredSettingValue('MARCHIVE_IS_SETUP')) ?? false,
    true,
  );
});

ipcMain.on(
  'utilities.schedule-run-process-is-paused',
  async (event, newValue: boolean) => {
    if (newValue != null)
      await setStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED', newValue);
    event.reply(
      'utilities.schedule-run-process-is-paused',
      (await getStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED')) ?? false,
      false,
    );
  },
);

ipcMain.on(
  'utilities.capture-part-run-process-is-paused',
  async (event, newValue: boolean) => {
    if (newValue != null)
      await setStoredSettingValue(
        'CAPTURE_PART_RUN_PROCESS_IS_PAUSED',
        newValue,
      );
    event.reply(
      'utilities.capture-part-run-process-is-paused',
      (await getStoredSettingValue('CAPTURE_PART_RUN_PROCESS_IS_PAUSED')) ??
        false,
      false,
    );
  },
);

ipcMain.on(
  'utilities.open-external-url-in-browser',
  async (event, url: string) => {
    if (url == null) return;
    shell.openExternal(url);
  },
);

ipcMain.on(
  'utilities.open-internal-path-in-default-program',
  async (event, path: string) => {
    if (path == null) return;
    shell.openPath(path);
  },
);

ipcMain.on('utilities.focused-window.toggle-maximize', async (event) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow == null) return;
  focusedWindow.isMaximized()
    ? focusedWindow.unmaximize()
    : focusedWindow.maximize();
});

ipcMain.on('utilities.focused-window.open-application-menu', async (event) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow == null) return;

  const menu = Menu.getApplicationMenu();
  if (menu == null) return;

  menu.popup({ window: focusedWindow });
});
