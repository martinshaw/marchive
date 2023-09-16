import fs from "node:fs"
import os from 'node:os'
import path from "node:path"
import { Menu, Tray, app, dialog, nativeImage, nativeTheme } from "electron"
import { internalRootPath } from "../paths"
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from "./app/repositories/LocalFileRepository"
import { cleanupAndQuit, closeAllWindows, createWindow } from "./main"
import { getStoredSettingValue, setStoredSettingValue } from "./app/repositories/StoredSettingRepository"

const createTray = async () => {
  const isDarkMode = nativeTheme.shouldUseDarkColors

  let iconFileName = 'tray-light.png'
  if (process.platform === 'win32') iconFileName = isDarkMode ? 'tray-dark.ico' : 'tray-light.ico'
  else iconFileName = isDarkMode ? 'tray-dark.png' : 'tray-light.png'

  const iconPath = path.join(internalRootPath, 'assets', iconFileName)
  if (fs.existsSync(iconPath) === false) throw new Error(`Tray icon could not be found ${iconPath}`)

  const iconDataUrl = retrieveFileAsBase64DataUrlFromAbsolutePath(iconPath)
  if (iconDataUrl == null) throw new Error(`Tray icon data URL could not be generated ${iconPath} ${iconDataUrl}`)

  let iconImage = nativeImage.createFromDataURL(iconDataUrl)
  iconImage = iconImage.resize({ width: 16, height: 16 })

  const tray = new Tray(iconImage)

  if (process.platform === 'win32') {
    /**
     * TODO: Fix this. Why is it not recognising overload signature? It did before, then I added the `regenerateContextMenu`
     *   function and it stopped working
     */
    //@ts-ignore
    tray.on('click', tray.popUpContextMenu);
  }

  tray.setToolTip('Marchive')

  let greeting = 'Hi, this is your Marchive'
  if (os.userInfo().username) greeting = `Hi ${os.userInfo().username}, this is your Marchive`

  let scheduleRunProcessIsPaused = await getStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED') === true
  let capturePartRunProcessIsPaused = await getStoredSettingValue('CAPTURE_PART_RUN_PROCESS_IS_PAUSED') === true

  const scheduleRunProcessOnClickHandler = async () => {
    await setStoredSettingValue('SCHEDULE_RUN_PROCESS_IS_PAUSED', !scheduleRunProcessIsPaused)
    scheduleRunProcessIsPaused = !scheduleRunProcessIsPaused
    regenerateContextMenu()
  }
  const capturePartRunProcessOnClickHandler = async () => {
    await setStoredSettingValue('CAPTURE_PART_RUN_PROCESS_IS_PAUSED', !capturePartRunProcessIsPaused)
    capturePartRunProcessIsPaused = !capturePartRunProcessIsPaused
    regenerateContextMenu()
  }

  const regenerateContextMenu = async () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: greeting,
        type: 'normal',
        enabled: false,
      },
      {
        label: scheduleRunProcessIsPaused ? 'Scheduled Sources are Paused' : 'Pause Scheduled Sources',
        type: 'checkbox',
        checked: scheduleRunProcessIsPaused,
        click: scheduleRunProcessOnClickHandler,
      },
      {
        label: capturePartRunProcessIsPaused ? 'Queued Downloads are Paused' : 'Pause Queued Downloads',
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
        click: () => { createWindow() },
      },
      {
        label: 'Quit',
        type: 'normal',
        click: () => {
          app.focus({ steal: true })
          dialog.showMessageBox({
            type: 'question',
            buttons: ['Yes, Quit Marchive', 'No, but Close All Windows', 'Cancel'],
            defaultId: 2,
            title: '',
            message: 'Are you sure you want to quit Marchive? It will stop downloading from your scheduled and queued sources.',
          })
            .then((result) => {
              if (result.response === 0) cleanupAndQuit()
              else if (result.response === 1) closeAllWindows()
            })
        },
      },
    ])
    tray.setContextMenu(contextMenu)
  }

  regenerateContextMenu()

  return tray
}

export default createTray
