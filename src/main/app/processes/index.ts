/*
 * All Rights Reserved, (c) 2023 CodeAtlas LTD.
 *
 * Author: Martin Shaw (developer@martinshaw.co)
 * File Name: index.d.ts
 * Created:  2023-09-06T05:12:20.702Z
 * Modified: 2023-09-06T05:12:20.702Z
 *
 * Description: description
 */

import path from 'node:path'
import { processesScriptsPath } from '../../../paths'

export type ProcessDetailsType = {
  name: string
  path: string
}

export const processDetails = [
  {
    name: 'CapturePartRunProcess',
    path: path.join(processesScriptsPath, 'CapturePartRunProcess.ts'),
  },
  {
    name: 'ScheduleRunProcess',
    path: path.join(processesScriptsPath, 'ScheduleRunProcess.ts'),
  },
] as const

export type ProcessDetailsNameType = typeof processDetails[number]['name']
export type ProcessDetailsPathType = typeof processDetails[number]['path']

/**
 * Inspired by https://www.matthewslipper.com/2019/09/22/everything-you-wanted-electron-child-process.html and
 *   https://stackoverflow.com/questions/52569406/invoke-a-child-process-via-fork-when-using-ts-node and
 *   https://github.com/mslipper/electron-child-process-playground
 */
