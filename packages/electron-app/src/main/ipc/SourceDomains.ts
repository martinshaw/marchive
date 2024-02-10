/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomains.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron';

import SourceDomainListAction from '../app/actions/SourceDomain/SourceDomainListAction';
import SourceDomainShowAction from '../app/actions/SourceDomain/SourceDomainShowAction';
import SourceDomainCountAction from '../app/actions/SourceDomain/SourceDomainCountAction';

export type SourceDomainsChannels =
  | 'source-domains.list'
  | 'source-domains.show'
  | 'source-domains.count';

ipcMain.on('source-domains.list', async (event, withSources: boolean) => {
  return SourceDomainListAction(withSources)
    .then((sourceDomains) => {
      event.reply('source-domains.list', sourceDomains, null);
    })
    .catch((error) => {
      console.error(error);
      event.reply('source-domains.list', null, error);
    });
});

ipcMain.on(
  'source-domains.show',
  async (event, sourceDomainId: number, withSources: boolean) => {
    return SourceDomainShowAction(sourceDomainId, withSources)
      .then((sourceDomain) => {
        event.reply('source-domains.show', sourceDomain, null);
      })
      .catch((error) => {
        console.error(error);
        event.reply('source-domains.show', null, error);
      });
  },
);

ipcMain.on('source-domains.count', async (event) => {
  return SourceDomainCountAction()
    .then((count) => {
      event.reply('source-domains.count', count, null);
    })
    .catch((error) => {
      console.error(error);
      event.reply('source-domains.count', null, error);
    });
});
