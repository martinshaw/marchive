/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-08-22T20:33:52.038Z
Modified: 2023-08-22T20:33:52.039Z

Description: description
*/
import path from 'node:path'


/**
 * Child processes forked from the main process do not allow access to the 'electron' module,
 *   therefore we must pass these paths as environment variables when forking.
 */

let userAppDataPath: string = process?.env?.USER_APP_DATA_PATH ?? ''
let downloadsPath: string = process?.env?.DOWNLOADS_PATH ?? ''
let appLogsPath: string = process?.env?.APP_LOGS_PATH ?? ''

if (typeof process.versions['electron'] !== 'undefined' && ['renderer', 'browser'].includes(process.type)) {
  const {app} = require('electron')

  userAppDataPath = app.getPath('userData')
  downloadsPath = app.getPath('downloads')
  appLogsPath = app.getPath('logs')
} else {
  if (userAppDataPath === '' || userAppDataPath == null) throw new Error('When forking a child process, you must pass the USER_APP_DATA_PATH environment variable containing the path to the user\'s app data directory from the main process.')
  if (downloadsPath === '' || downloadsPath == null) throw new Error('When forking a child process, you must pass the DOWNLOADS_PATH environment variable containing the path to the user\'s downloads directory from the main process.')
  if (appLogsPath === '' || appLogsPath == null) throw new Error('When forking a child process, you must pass the APP_LOGS_PATH environment variable containing the path to the user\'s app logs directory from the main process.')
}


// Do not use `internalRootPath` nor `internalNodeModulesPath` for any write operations. Use `userAppDataPath` instead.
export const internalRootPath = path.join(__dirname, '..')
export const internalNodeModulesPath = path.join(internalRootPath, 'node_modules')

export { userAppDataPath, downloadsPath, appLogsPath }

export const userAppDataDatabasesPath = path.join(userAppDataPath, 'databases')
export const userAppDataDatabaseFilePath = path.join(userAppDataDatabasesPath, 'marchive-desktop.db')

export const downloadsAppPath = path.join(downloadsPath, process.env.APP_NAME || 'marchive')
export const downloadCapturesPath = path.join(downloadsAppPath, 'captures')
export const downloadSourceDomainFaviconsPath = path.join(downloadsAppPath, 'favicons')

export const processesScriptsPath = path.join(internalRootPath, 'src', 'main', 'app', 'processes')
