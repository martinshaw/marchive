/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: providers.ts
Created:  2023-08-31T03:40:36.248Z
Modified: 2023-08-31T03:40:36.248Z

Description: description
*/

import { ipcMain } from "electron";
import ProviderListAction from "../app/actions/Provider/ProviderListAction";
import ProviderValidateAction from "../app/actions/Provider/ProviderValidateAction";

export type ProvidersChannels =
  | 'providers.list'
  | 'providers.validate'

ipcMain.on('providers.list', async (event) => {
  return ProviderListAction()
    .then(providers => { event.reply('providers.list', providers, null) })
    .catch(error => { event.reply('providers.list', null, error) })
})

ipcMain.on('providers.validate', async (event, url: string) => {
  console.log('providers.validate', url)

  return ProviderValidateAction(url)
    .then(providers => { event.reply('providers.validate', providers, null) })
    .catch(error => { event.reply('providers.validate', null, error) })
})
