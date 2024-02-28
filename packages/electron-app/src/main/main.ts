/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import logger from 'logger';
import path from 'node:path';
import contextMenu from 'electron-context-menu';
import windowStateKeeper from 'electron-window-state';
import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  nativeTheme,
  shell,
  TitleBarOverlay,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './utilities/resolveHtmlPath';
import createTray from './tray';
import WindowMenuBuilder from './menu';

import './ipc/Captures';
import './ipc/DataProviders';
import './ipc/Schedules';
import './ipc/Sources';
import './ipc/SourceDomains';
import './ipc/Utilities';
import './ipc/Watchers';
import './ipc/Renderers';
import './ipc/StoredSettings';

import './protocols';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

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

export const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const darkBackgroundColor = '#1e1e1e';
  const lightBackgroundColor = '#f6f7f9';

  mainWindowId = generateNewWindowId();

  if (mainWindowId == null) return;
  if (windows[mainWindowId] != null) return;

  // TODO: If we have different types of windows, we should use the `path` prop to differentiate stored size/position preferences
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 800,
  });

  const windowBackgroundColor: () => string = () =>
    nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor;

  const windowControlsTitleBarOverlay: () => TitleBarOverlay = () => ({
    color: nativeTheme.shouldUseDarkColors ? '#383e47' : '#ffffff',
    symbolColor: '#eeeeee',
  });

  let windowControlsAdditions: Partial<BrowserWindowConstructorOptions> = {
    titleBarStyle: 'default',
  };
  if (process.platform === 'darwin')
    windowControlsAdditions = {
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 15, y: 17 },
    };
  if (process.platform === 'win32')
    windowControlsAdditions = {
      titleBarStyle: 'hidden',
      titleBarOverlay: windowControlsTitleBarOverlay(),
    };

  windows[mainWindowId] = new BrowserWindow({
    ...windowControlsAdditions,
    show: false,
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 364,
    minHeight: 600,
    title: 'Marchive',
    center: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webviewTag: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      spellcheck: true,
    },
    backgroundColor: windowBackgroundColor(),
  });

  mainWindowState.manage(windows[mainWindowId]);

  nativeTheme.on('updated', () => {
    if (mainWindowId == null) return;

    windows[mainWindowId].setBackgroundColor(windowBackgroundColor());

    if (process.platform !== 'darwin')
      windows[mainWindowId].setTitleBarOverlay(windowControlsTitleBarOverlay());
  });

  windows[mainWindowId].on('focus', () => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    windows[mainWindowId].webContents.send(
      'renderer.focused-window.is-focused',
    );
  });

  windows[mainWindowId].on('blur', () => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    windows[mainWindowId].webContents.send(
      'renderer.focused-window.is-blurred',
    );
  });

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

    if (app.dock != null) app.dock.show();
  });

  windows[mainWindowId].on('closed', () => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    delete windows[mainWindowId];
  });

  // Mainly to resolve issue with hyperlinks in rendered Mozilla Readability causing the whole app to become the linked URL
  windows[mainWindowId].webContents.on('will-navigate', (event, url) => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    const allowedTemplateFiles = ['index.html'];

    if (
      url.indexOf('http://localhost') === 0 ||
      allowedTemplateFiles.some(
        (templateFile) =>
          url.indexOf(templateFile) > -1 && url.indexOf('://') < 0,
      )
    )
      return;

    event.preventDefault();
    shell.openExternal(url);

    return false;
  });

  windows[mainWindowId].loadURL(resolveHtmlPath('index.html'));

  windows[mainWindowId].on('closed', () => {
    if (mainWindowId == null) return;
    if (windows[mainWindowId] == null) return;

    delete windows[mainWindowId];
  });

  const windowMenuBuilder = new WindowMenuBuilder(windows[mainWindowId]);
  windowMenuBuilder.buildMenu();

  // Open urls in the user's browser
  windows[mainWindowId].webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    cleanupAndQuit();
  }
});

app
  .whenReady()
  .then(() => {
    ipcMain.emit('watchers.schedules.start');
    ipcMain.emit('watchers.capture-parts.start');

    createTray();

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

    createWindow();

    app.on('activate', () => {
      if (mainWindowId == null) return;
      if (windows[mainWindowId] == null) return;

      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (windows[mainWindowId] === null) createWindow();
    });
  })
  .catch((error) => {
    logger.error('Electron app whenReady error occurred');
    logger.error(error);
  });

export const cleanupAndQuit = () => {
  logger.info('Cleaning up and quitting...');

  // TODO: Kill child processes gracefully ???

  // TODO: Release / delete locks on processes ???

  app.quit();
};

export const closeAllWindows = () => {
  logger.info('Closing all windows...');

  Object.keys(windows).forEach((windowId) => {
    if (windows[windowId] == null) return;

    windows[windowId].close();
  });
};
