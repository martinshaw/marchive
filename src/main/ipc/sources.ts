/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: sources.ts
Created:  2023-08-01T21:00:20.815Z
Modified: 2023-08-01T21:00:20.815Z

Description: description
*/

import { ipcMain } from 'electron';

// ipcMain.on('sources.get-source-providers', async (event) => {
//   const sourceProviders = await getSourceProviders();

//   event.reply(
//     'sources.get-source-providers',
//     sourceProviders.map((sourceProvider) => sourceProvider.toObject())
//   );
// });

// ipcMain.on('sources.validate-url-with-source-providers', async (event, url) => {
//   event.reply(
//     'sources.validate-url-with-source-providers',
//     await validateUrlWithSourceProviders(url)
//   );
// });

// ipcMain.on('sources.submit-new-source', async (event, url) => {
//   const validSourceProvidersForUrl = await validateUrlWithSourceProviders(url);

//   if (validSourceProvidersForUrl.length === 0) {
//     event.reply(
//       'sources.submit-new-source',
//       null,
//       'No valid source providers for URL'
//     );
//     return;
//   }

//   const sourceProvider = await getSourceProviderByIdentifier(
//     validSourceProvidersForUrl[validSourceProvidersForUrl.length - 1]
//   );

//   if (sourceProvider == null) {
//     event.reply(
//       'sources.submit-new-source',
//       null,
//       'No valid source provider found'
//     );
//     return;
//   }

//   const newSource = await createSource(sourceProvider.getIdentifier(), url);

//   event.reply('sources.submit-new-source', newSource, null);
// });

// ipcMain.on('sources.get-sources', async (event) => {
//   const sources = await Source.findAll();
//   event.reply('sources.get-sources', sources);
// });
