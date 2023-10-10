/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: default.ts
Created:  2023-09-26T18:09:24.211Z
Modified: 2023-09-26T18:09:24.211Z

Description: description
*/

import { Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import {
  clearDatabaseAndDeleteDownloadsMenuAction,
  clearDatabaseMenuAction,
  needMoreSpaceMenuAction,
  retrieveIconForWebsiteMenuAction,
} from './actions';
import { WindowMenuItemConstructorOptions } from '.';

const buildDefaultTemplate: (
  mainWindow: BrowserWindow
) => WindowMenuItemConstructorOptions[] = (mainWindow) => {
  const templateDefault: WindowMenuItemConstructorOptions[] = [
    {
      label: '&File',
      submenu: [
        {
          label: '&New Source',
          accelerator: 'Ctrl+N',
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
          label: '&Close Window',
          accelerator: 'Ctrl+W',
          enabled: mainWindow !== null,
          role: 'close',
        },
        {
          label: '&Quit Marchive',
          accelerator: 'Ctrl+Q',
          role: 'quit',
        },
      ],
    },
    {
      label: '&Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Ctrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Ctrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Ctrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Ctrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Ctrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Ctrl+A',
          selector: 'selectAll:',
        },
      ],
    },
    {
      label: '&View',
      submenu:
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
          ? [
              {
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                  mainWindow.webContents.reload();
                },
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen());
                },
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  mainWindow.webContents.toggleDevTools();
                },
              },
            ]
          : [
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen());
                },
              },
            ],
    },
    {
      label: '&Utilities',
      submenu: [
        {
          label: '&Clear Database',
          click: async () => {
            return clearDatabaseMenuAction(mainWindow);
          },
        },
        {
          label: 'Clear Database && &Delete Downloads Folder',
          click: async () => {
            return clearDatabaseAndDeleteDownloadsMenuAction(mainWindow);
          },
        },
        {
          label: 'Retrieve &Icon for Website',
          click: async () => {
            return retrieveIconForWebsiteMenuAction(mainWindow);
          },
        },
        {
          label: 'Need More &Space?',
          click: async () => {
            return needMoreSpaceMenuAction(mainWindow);
          },
        },
      ],
    },
  ];

  return templateDefault;
};

export default buildDefaultTemplate;
