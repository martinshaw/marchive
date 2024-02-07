/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomains.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron'

import SourceDomainListAction from '../app/actions/SourceDomain/SourceDomainListAction'

export type SourceDomainsChannels =
  | 'source-domains.list'

ipcMain.on('source-domains.list', async (event, withSources: boolean, withSourceSchedules: boolean) => {
  return SourceDomainListAction(withSources, withSourceSchedules)
    .then(sourceDomains => { event.reply('source-domains.list', sourceDomains, null) })
    .catch(error => { console.error(error); event.reply('source-domains.list', null, error) })
})
