/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: sources.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron'
import SourceListAction from '../app/actions/Source/SourceListAction'
import SourceCreateAction from '../app/actions/Source/SourceCreateAction'
import SourceDeleteAction from '../app/actions/Source/SourceDeleteAction'

export type SourcesChannels =
  | 'sources.list'
  | 'sources.create'
  | 'sources.delete'

ipcMain.on('sources.list', async (event) => {
  return SourceListAction()
    .then(sources => { event.reply('sources.list', sources, null) })
    .catch(error => { event.reply('sources.list', null, error) })
})

ipcMain.on('sources.create', async (event, url: string, dataProviderIdentifier: string) => {
  return SourceCreateAction(url, dataProviderIdentifier)
    .then(source => { event.reply('sources.create', source, null) })
    .catch(error => { event.reply('sources.create', null, error) })
})

ipcMain.on('sources.delete', async (event, sourceId: number) => {
  return SourceDeleteAction(sourceId)
    .then(source => { event.reply('sources.delete', source, null) })
    .catch(error => { event.reply('sources.delete', null, error) })
})
