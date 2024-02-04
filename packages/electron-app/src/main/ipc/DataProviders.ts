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

export type DataProvidersChannels =
  | 'data-providers.list'
  | 'data-providers.validate'

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
