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

export type ProcessDetailsType = {
  name: string
  paths: {
    development: [string, string];
    production: [string, string];
  }
}

const monorepoPackageSourceEntryPointAndWorkingDirectoryPath = (packageName: string): [string, string] => {
  return [
    path.join(__dirname, '..', '..', '..', '..', '..', packageName, 'src', 'index.ts'),
    path.join(__dirname, '..', '..', '..', '..', '..', packageName),
  ];
}

// TODO: Implement and test
const asarUnpackedBundleEntryPointAndWorkingDirectoryPath = (packageName: string): [string, string] => {
  return [
    path.join(__dirname, '..', '..', '..', '..', 'asar.unpacked', packageName, 'main.cjs'),
    path.join(__dirname, '..', '..', '..', '..', 'asar.unpacked'),
  ];
}

export const processDetails: ProcessDetailsType[] = [
  {
    name: 'ScheduleRunProcess',
    paths: {
      development: monorepoPackageSourceEntryPointAndWorkingDirectoryPath('schedule-run-child-process'),
      production: asarUnpackedBundleEntryPointAndWorkingDirectoryPath('schedule-run-child-process'),
    }
  },
  {
    name: 'CapturePartRunProcess',
    paths: {
      development: monorepoPackageSourceEntryPointAndWorkingDirectoryPath('capture-part-run-child-process'),
      production: asarUnpackedBundleEntryPointAndWorkingDirectoryPath('capture-part-run-child-process'),
    }
  },
]

export type ProcessDetailsNameType = typeof processDetails[number]['name']

export const getProcessDetailPath = (processDetail: ProcessDetailsType): [string, string] => {
  const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  const environment = isDebug ? 'development' : 'production';

  return processDetail.paths[environment];
}

/**
 * Inspired by https://www.matthewslipper.com/2019/09/22/everything-you-wanted-electron-child-process.html and
 *   https://stackoverflow.com/questions/52569406/invoke-a-child-process-via-fork-when-using-ts-node and
 *   https://github.com/mslipper/electron-child-process-playground
 */

