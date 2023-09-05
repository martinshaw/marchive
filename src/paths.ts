/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-08-22T20:33:52.038Z
Modified: 2023-08-22T20:33:52.039Z

Description: description
*/

import { app } from 'electron'
import path from 'node:path'

// Do not use this for any write operations. Use app.getPath('userData') instead.
export const internalRootPath = path.join(__dirname, '..')
export const internalNodeModulesPath = path.join(internalRootPath, 'node_modules')

export const userAppDataPath = path.join(app.getPath('userData'))
export const userAppDataDatabasesPath = path.join(userAppDataPath, 'databases')
export const userAppDataDatabaseFilePath = path.join(userAppDataDatabasesPath, 'marchive-desktop.db')

export const downloadsPath = path.join(app.getPath('downloads'), process.env.APP_NAME || 'marchive')
export const downloadCapturesPath = path.join(downloadsPath, 'captures')
export const downloadSourceDomainFaviconsPath = path.join(downloadsPath, 'favicons')

export const appLogsPath = path.join(app.getPath('logs'))
