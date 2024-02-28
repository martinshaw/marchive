/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Sources.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron';

import SourceListAction from '../app/actions/Source/SourceListAction';
import SourceCountAction from '../app/actions/Source/SourceCountAction';
import SourceShowAction from '../app/actions/Source/SourceShowAction';
import SourceCreateAction from '../app/actions/Source/SourceCreateAction';
import SourceDeleteAction from '../app/actions/Source/SourceDeleteAction';
import SourcePromptForDeletionAction from '../app/actions/Source/SourcePromptForDeletionAction';

export type SourcesChannels =
  | 'sources.list'
  | 'sources.count'
  | 'sources.show'
  | 'sources.create'
  | 'sources.delete'
  | 'sources.prompt-for-deletion';

ipcMain.on(
  'sources.list',
  async (event, withSchedules: boolean, withSourceDomain: boolean) => {
    return SourceListAction(withSchedules, withSourceDomain)
      .then((response) => {
        event.reply('sources.list', response, null);
      })
      .catch((error) => {
        event.reply('sources.list', null, error);
      });
  },
);

ipcMain.on('sources.count', async (event) => {
  return SourceCountAction()
    .then((response) => {
      event.reply('sources.count', response, null);
    })
    .catch((error) => {
      event.reply('sources.count', null, error);
    });
});

ipcMain.on(
  'sources.show',
  async (
    event,
    sourceId: number,
    withSourceDomain: boolean = false,
    withSchedules: boolean = false,
    withCaptures: boolean = false,
  ) => {
    return SourceShowAction(
      sourceId,
      withSourceDomain,
      withSchedules,
      withCaptures,
    )
      .then((response) => {
        event.reply('sources.show', response, null);
      })
      .catch((error) => {
        event.reply('sources.show', null, error);
      });
  },
);

ipcMain.on(
  'sources.create',
  async (event, url: string, dataProviderIdentifier: string) => {
    return SourceCreateAction(url, dataProviderIdentifier)
      .then((response) => {
        event.reply('sources.create', response, null);
      })
      .catch((error) => {
        event.reply('sources.create', null, error);
      });
  },
);

ipcMain.on('sources.delete', async (event, sourceId: number) => {
  return SourceDeleteAction(sourceId)
    .then((response) => {
      event.reply('sources.delete', response, null);
    })
    .catch((error) => {
      event.reply('sources.delete', null, error);
    });
});

ipcMain.on('sources.prompt-for-deletion', async (event, sourceId: number) => {
  return SourcePromptForDeletionAction(sourceId)
    .then((deleted) => {
      event.reply('sources.prompt-for-deletion', deleted, null);
    })
    .catch((error) => {
      event.reply('sources.prompt-for-deletion', null, error);
    });
});
