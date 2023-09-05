/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import contextMenu from 'electron-context-menu'
// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';

import './ipc/Captures';
import './ipc/DataProviders';
import './ipc/Schedules';
import './ipc/Sources';
import './ipc/Utilities';

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const windows: { [windowId: string]: BrowserWindow } = {};
let mainWindowId: string | null = null;

const generateNewWindowId: () => string = () => {
  const timestamp = new Date().getTime().toString();
  const random = Math.random().toString(36).substring(2, 15);

  // Create a new ID based on the timestamp
  const newWindowId = `${timestamp}-${random}`;

  // If the ID is already in use, try again recursively
  if (windows[newWindowId]) return generateNewWindowId();

  return newWindowId;
};

const createWindow = async () => {
  // if (isDebug) {
  //   await installExtensions();
  // }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindowId = generateNewWindowId();

  if (mainWindowId == null) return;
  if (windows[mainWindowId] != null) return;

  windows[mainWindowId] = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 364,
    minHeight: 600,
    titleBarStyle: 'default',
    title: 'Marchive',
    center: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
      spellcheck: true,
    },
  });

  windows[mainWindowId].loadURL(resolveHtmlPath('index.html'));

  windows[mainWindowId].on('ready-to-show', () => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    if (!windows[mainWindowId]) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      windows[mainWindowId].minimize();
    } else {
      windows[mainWindowId].show();
    }
  });

  windows[mainWindowId].on('closed', () => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    delete windows[mainWindowId];
  });

  const menuBuilder = new MenuBuilder(windows[mainWindowId]);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  windows[mainWindowId].webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Electron doesn't offer a usual context menu for input boxes, link etc...
 * This package adds a context menu to all input boxes, textareas and editable
 * I will use Blueprint JS's ContextMenu component to create a context menu for custom non-native elements
 */
contextMenu({
	showSaveImageAs: true,
  showCopyLink: false,
  showSaveLinkAs: false,
  showInspectElement: isDebug,
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindowId == null) return;
      if (windows[mainWindowId] == null) return;

      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (windows[mainWindowId] === null) createWindow();
    });
  })
  .catch(console.log);
