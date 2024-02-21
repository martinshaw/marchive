/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Utilities.ts
Created:  2023-08-01T20:04:09.893Z
Modified: 2023-08-01T20:04:09.893Z

Description: description
*/

import { Menu, shell, ipcMain, nativeTheme, BrowserWindow } from 'electron';

export type UtilitiesChannels =
  | 'utilities.is-dark-mode'
  | 'utilities.open-external-url-in-browser'
  | 'utilities.open-internal-path-in-default-program'
  | 'utilities.focused-window.toggle-maximize'
  | 'utilities.focused-window.open-application-menu';

ipcMain.on('utilities.is-dark-mode', async (event) => {
  event.reply('utilities.is-dark-mode', nativeTheme.shouldUseDarkColors);
});

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
