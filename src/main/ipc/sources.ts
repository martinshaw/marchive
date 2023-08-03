/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: sources.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron';
import { getSourceProviders } from '../repositories/SourceProviderRepository';

ipcMain.on('sources.get-source-providers', async (event) => {
  const sourceProviders = await getSourceProviders();

  event.reply(
    'sources.get-source-providers',
    JSON.stringify(
      sourceProviders.map((sourceProvider) => sourceProvider.toObject())
    )
  );
});
