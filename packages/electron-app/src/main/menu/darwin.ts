/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: darwin.ts
Created:  2023-09-26T18:05:49.535Z
Modified: 2023-09-26T18:05:49.535Z

Description: description
*/

import { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { cleanupAndQuit } from '../main';
import {
  clearDatabaseAndDeleteDownloadsMenuAction,
  clearDatabaseMenuAction,
  needMoreSpaceMenuAction,
  retrieveIconForWebsiteMenuAction,
} from './actions';
import { WindowMenuItemConstructorOptions } from '.';

const buildDarwinTemplate: (
  mainWindow: BrowserWindow
) => MenuItemConstructorOptions[] = (mainWindow) => {
  const subMenuAbout: WindowMenuItemConstructorOptions = {
    label: 'Marchive',
    submenu: [
      {
        label: 'About Marchive',
        selector: 'orderFrontStandardAboutPanel:',
      },
      { type: 'separator' },
      {
        label: 'Hide Marchive',
        accelerator: 'CmdOrCtrl+H',
        selector: 'hide:',
      },
      {
        label: 'Hide Others',
        accelerator: 'CmdOrCtrl+Shift+H',
        selector: 'hideOtherApplications:',
      },
      { label: 'Show All', selector: 'unhideAllApplications:' },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          cleanupAndQuit();
        },
      },
    ],
  };
  const subMenuFile: WindowMenuItemConstructorOptions = {
    label: 'File',
    submenu: [
      {
        label: 'New Source',
        accelerator: 'CmdOrCtrl+N',
        enabled: mainWindow !== null,
        click: () => {
          mainWindow.webContents.send(
            'renderer.focused-window.navigate',
            '/sources/create'
          );
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+W',
        enabled: mainWindow !== null,
        role: 'close',
      },
      {
        label: 'Quit Marchive',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit',
      },
    ],
  };
  const subMenuEdit: WindowMenuItemConstructorOptions = {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:',
      },
    ],
  };
  const subMenuMarchiveUtilities: MenuItemConstructorOptions = {
    label: 'Utilities',
    submenu: [
      {
        label: 'Clear Database',
        click: async () => {
          return clearDatabaseMenuAction(mainWindow);
        },
      },
      {
        label: 'Clear Database && Delete Downloads Folder',
        click: async () => {
          return clearDatabaseAndDeleteDownloadsMenuAction(mainWindow);
        },
      },
      {
        label: 'Retrieve Icon for Website',
        click: async () => {
          return retrieveIconForWebsiteMenuAction(mainWindow);
        },
      },
      {
        label: 'Need More Space?',
        click: async () => {
          return needMoreSpaceMenuAction(mainWindow);
        },
      },
    ],
  };
  const subMenuWindowDev: WindowMenuItemConstructorOptions = {
    label: 'Window',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          mainWindow.webContents.reload();
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: () => {
          mainWindow.webContents.toggleDevTools();
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+CmdOrCtrl+F',
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        selector: 'performMiniaturize:',
      },
      { label: 'Close', accelerator: 'CmdOrCtrl+W', selector: 'performClose:' },
      { type: 'separator' },
      { label: 'Bring All to Front', selector: 'arrangeInFront:' },
    ],
  };
  const subMenuWindowProd: WindowMenuItemConstructorOptions = {
    label: 'Window',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+CmdOrCtrl+F',
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        selector: 'performMiniaturize:',
      },
      { label: 'Close', accelerator: 'CmdOrCtrl+W', selector: 'performClose:' },
      { type: 'separator' },
      { label: 'Bring All to Front', selector: 'arrangeInFront:' },
    ],
  };

  const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  const subMenuWindow = isDebug ? subMenuWindowDev : subMenuWindowProd;

  return [
    subMenuAbout,
    subMenuFile,
    subMenuEdit,
    subMenuMarchiveUtilities,
    subMenuWindow,
  ];
};

export default buildDarwinTemplate;
