import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import {
  Menu,
  NativeImage,
  Tray,
  app,
  dialog,
  nativeImage,
  nativeTheme,
} from 'electron';
import { readOnlyInternalRootPath } from '../paths';
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from './app/repositories/LocalFileRepository';
import { cleanupAndQuit, closeAllWindows, createWindow } from './main';
import {
  getStoredSettingValue,
  setStoredSettingValue,
} from './app/repositories/StoredSettingRepository';
import { webContents } from 'electron';

const isDarkMode = nativeTheme.shouldUseDarkColors;

const createWin32TrayIcon: () => string = () => {
  const iconFileName = isDarkMode ? 'tray-dark.ico' : 'tray-light.ico';
  const iconPath = path.join(readOnlyInternalRootPath, 'assets', iconFileName);
  if (fs.existsSync(iconPath) === false)
    throw new Error(`Tray icon could not be found ${iconPath}`);

  return iconPath;
};

const createGenericTrayIcon: () => NativeImage = () => {
  const iconFileName = isDarkMode ? 'tray-dark.png' : 'tray-light.png';
  const iconPath = path.join(readOnlyInternalRootPath, 'assets', iconFileName);
  if (fs.existsSync(iconPath) === false)
    throw new Error(`Tray icon could not be found ${iconPath}`);

  const iconDataUrl = retrieveFileAsBase64DataUrlFromAbsolutePath(iconPath);
  if (iconDataUrl == null)
    throw new Error(
      `Tray icon data URL could not be generated ${iconPath} ${iconDataUrl}`
    );

  let iconImage = nativeImage.createFromDataURL(iconDataUrl);
  iconImage = iconImage.resize({ width: 16, height: 16 });

  return iconImage;
};

const createTray = async () => {
  const tray = new Tray(
    process.platform === 'win32'
      ? createWin32TrayIcon()
      : createGenericTrayIcon()
  );

  tray.setToolTip('Marchive');

  let greeting = 'Hi, this is your Marchive';
  if (os.userInfo().username)
    greeting = `Hi ${os.userInfo().username}, this is your Marchive`;

  let scheduleRunProcessIsPaused =
    (await getStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED')) === true;
  let capturePartRunProcessIsPaused =
    (await getStoredSettingValue('CAPTURE_PART_RUN_PROCESS_IS_PAUSED')) ===
    true;

  nativeTheme.on('updated', () => {
    tray.setImage(
      process.platform === 'win32'
        ? createWin32TrayIcon()
        : createGenericTrayIcon()
    );
  });

  const scheduleRunProcessOnClickHandler = async () => {
    await setStoredSettingValue(
      'SCHEDULE_RUN_PROCESS_IS_PAUSED',
      !scheduleRunProcessIsPaused
    );

    webContents.getAllWebContents().forEach((webContent) => {
      webContent.send(
        'utilities.schedule-run-process-is-paused',
        !scheduleRunProcessIsPaused
      );
    });

    scheduleRunProcessIsPaused = !scheduleRunProcessIsPaused;
    regenerateContextMenu();
  };
  const capturePartRunProcessOnClickHandler = async () => {
    await setStoredSettingValue(
      'CAPTURE_PART_RUN_PROCESS_IS_PAUSED',
      !capturePartRunProcessIsPaused
    );

    webContents.getAllWebContents().forEach((webContent) => {
      webContent.send(
        'utilities.capture-part-run-process-is-paused',
        !capturePartRunProcessIsPaused
      );
    });

    capturePartRunProcessIsPaused = !capturePartRunProcessIsPaused;
    regenerateContextMenu();
  };

  let contextMenu: Menu | null = null;
  const regenerateContextMenu = async () => {
    contextMenu = Menu.buildFromTemplate([
      {
        label: greeting,
        type: 'normal',
        enabled: false,
      },
      {
        label: scheduleRunProcessIsPaused
          ? 'Scheduled Sources are Paused'
          : 'Pause Scheduled Sources',
        type: 'checkbox',
        checked: scheduleRunProcessIsPaused,
        click: scheduleRunProcessOnClickHandler,
      },
      {
        label: capturePartRunProcessIsPaused
          ? 'Queued Downloads are Paused'
          : 'Pause Queued Downloads',
        type: 'checkbox',
        checked: capturePartRunProcessIsPaused,
        click: capturePartRunProcessOnClickHandler,
      },
      {
        type: 'separator',
      },
      {
        label: 'Open Marchive',
        type: 'normal',
        click: () => {
          createWindow();
        },
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          app.focus({ steal: true });
          dialog
            .showMessageBox({
              type: 'question',
              buttons: [
                'Yes, Quit Marchive',
                'No, but Close All Windows',
                'Cancel',
              ],
              defaultId: 2,
              title: '',
              message:
                'Are you sure you want to quit Marchive? It will stop downloading from your scheduled and queued sources.',
            })
            .then((result) => {
              if (result.response === 0) cleanupAndQuit();
              else if (result.response === 1) closeAllWindows();
            });
        },
      },
    ]);

    tray.setContextMenu(contextMenu);

    if (process.platform === 'win32' && contextMenu != null) {
      tray.removeAllListeners('click');

      tray.on('click', () => {
        if (contextMenu == null) return;
        tray.popUpContextMenu(contextMenu);
      });
    }
  };

  regenerateContextMenu();

  return tray;
};

export default createTray;
