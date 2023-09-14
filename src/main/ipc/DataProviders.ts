/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: data-providers.ts
Created:  2023-08-31T03:40:36.248Z
Modified: 2023-08-31T03:40:36.248Z

Description: description
*/

import { ipcMain } from "electron";
import DataProviderListAction from "../app/actions/DataProvider/DataProviderListAction";
import DataProviderValidateAction from "../app/actions/DataProvider/DataProviderValidateAction";
import DataProviderGetFileFromCaptureDirectoryAction from "../app/actions/DataProvider/DataProviderGetFileFromCaptureDirectoryAction";
import DataProviderGetFileFromCapturePartDirectoryAction from "../app/actions/DataProvider/DataProviderGetFileFromCapturePartDirectoryAction";

export type DataProvidersChannels =
  | 'data-providers.list'
  | 'data-providers.validate'
  | 'data-providers.get-image-from-capture-directory'
  | 'data-providers.get-text-from-capture-directory'
  | 'data-providers.get-image-from-capture-part-directory'
  | 'data-providers.get-text-from-capture-part-directory'

ipcMain.on('data-providers.list', async (event) => {
  return DataProviderListAction()
    .then(dataProviders => { event.reply('data-providers.list', dataProviders, null) })
    .catch(error => { event.reply('data-providers.list', null, error) })
})

ipcMain.on('data-providers.validate', async (event, url: string) => {
  return DataProviderValidateAction(url)
    .then(dataProviders => { event.reply('data-providers.validate', dataProviders, null) })
    .catch(error => { event.reply('data-providers.validate', null, error) })
})

ipcMain.on('data-providers.get-image-from-capture-directory', async (event, captureId: number | null, path: string) => {
  return DataProviderGetFileFromCaptureDirectoryAction(captureId, path, 'image')
    .then(image => { event.reply('data-providers.get-image-from-capture-directory', image.resolvedUrl, image.fullPath, null) })
    .catch(error => { event.reply('data-providers.get-image-from-capture-directory', null, null, error) })
})

ipcMain.on('data-providers.get-text-from-capture-directory', async (event, captureId: number | null, path: string) => {
  return DataProviderGetFileFromCaptureDirectoryAction(captureId, path, 'text')
    .then(text => { event.reply('data-providers.get-text-from-capture-directory', text.resolvedUrl, text.fullPath, null) })
    .catch(error => { event.reply('data-providers.get-text-from-capture-directory', null, null, error) })
})

ipcMain.on('data-providers.get-image-from-capture-part-directory', async (event, capturePartId: number | null, path: string) => {
  return DataProviderGetFileFromCapturePartDirectoryAction(capturePartId, path, 'image')
    .then(image => { event.reply('data-providers.get-image-from-capture-part-directory', image.resolvedUrl, image.fullPath, null) })
    .catch(error => { event.reply('data-providers.get-image-from-capture-part-directory', null, null, error) })
})

ipcMain.on('data-providers.get-text-from-capture-part-directory', async (event, capturePartId: number | null, path: string) => {
  return DataProviderGetFileFromCapturePartDirectoryAction(capturePartId, path, 'text')
    .then(text => { event.reply('data-providers.get-text-from-capture-part-directory', text.resolvedUrl, text.fullPath, null) })
    .catch(error => { event.reply('data-providers.get-text-from-capture-part-directory', null, null, error) })
})
