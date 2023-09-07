import fs from "node:fs"
import os from 'node:os'
import path from "node:path"
import { Menu, Tray, nativeImage, nativeTheme } from "electron"
import { internalRootPath } from "../paths"
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from "./app/repositories/LocalFileRepository"

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

  let scheduleRunProcessIsRunning = true
  let capturePartRunProcessIsRunning = true

  const scheduleRunProcessOnClickHandler = () => {
    //

    regenerateContextMenu()
  }
  const capturePartRunProcessOnClickHandler = () => {
    //

    regenerateContextMenu()
  }

  const regenerateContextMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: greeting,
        type: 'normal',
        enabled: false,
      },
      {
        label: 'Queue Scheduled Sources',
        type: 'checkbox',
        checked: scheduleRunProcessIsRunning,
        click: scheduleRunProcessOnClickHandler,
      },
      {
        label: 'Process Downloads',
        type: 'checkbox',
        checked: capturePartRunProcessIsRunning,
        click: capturePartRunProcessOnClickHandler,
      },
    ])
    tray.setContextMenu(contextMenu)
  }

  regenerateContextMenu()

  return tray
}

export default createTray
