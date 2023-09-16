/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Sources.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron'
import SourceListAction from '../app/actions/Source/SourceListAction'
import SourceCountAction from '../app/actions/Source/SourceCountAction'
import SourceShowAction from '../app/actions/Source/SourceShowAction'
import SourceCreateAction from '../app/actions/Source/SourceCreateAction'
import SourceDeleteAction from '../app/actions/Source/SourceDeleteAction'
import { Op } from 'sequelize'

export type SourcesChannels =
  | 'sources.list'
  | 'sources.list-without-source-domains'
  | 'sources.count'
  | 'sources.show'
  | 'sources.create'
  | 'sources.delete'

ipcMain.on('sources.list', async (event) => {
  return SourceListAction()
    .then(sources => { event.reply('sources.list', sources, null) })
    .catch(error => { event.reply('sources.list', null, error) })
})

ipcMain.on('sources.list-without-source-domains', async (event) => {
  return SourceListAction({
    sourceDomainId: {[Op.eq]: null}
  })
    .then(sources => { event.reply('sources.list-without-source-domains', sources, null) })
    .catch(error => { event.reply('sources.list-without-source-domains', null, error) })
})

ipcMain.on('sources.count', async (event) => {
  return SourceCountAction()
    .then(count => { event.reply('sources.count', count, null) })
    .catch(error => { event.reply('sources.count', null, error) })
})

ipcMain.on('sources.show', async (
  event,
  sourceId: number | null = null,
  withSourceDomain: boolean = false,
  withSchedules: boolean = false,
  withCaptures: boolean = false
) => {
  return SourceShowAction(sourceId, withSourceDomain, withSchedules, withCaptures)
    .then(source => { event.reply('sources.show', source, null) })
    .catch(error => { event.reply('sources.show', null, error) })
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
