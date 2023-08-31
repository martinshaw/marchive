/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-08-22T20:33:52.038Z
Modified: 2023-08-22T20:33:52.039Z

Description: description
*/

import path from 'node:path'

export const rootPath = path.join(__dirname, '..')

export const resourcesPath = path.join(rootPath, 'resources')

export const downloadsPath = path.join(rootPath, 'downloads')
