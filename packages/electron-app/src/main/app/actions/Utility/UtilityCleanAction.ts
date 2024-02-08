/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilityCleanAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import {
  userDownloadsCapturesPath,
  userDownloadsSourceDomainFaviconsPath,
} from 'utilities';
import fs from 'node:fs';
import logger from 'logger';
// import { umzug } from 'database';

const UtilityCleanAction = async (
  database: boolean = false,
  downloads: boolean = false,
): Promise<void> => {
  // if (database) await cleanDatabase();
  // if (downloads) await cleanDownloads();
};

// const cleanDatabase = async (): Promise<void> => {
//   await umzug.down({ to: 0 });
//   await umzug.up();
// };

// const cleanDownloads = async (): Promise<void> => {
//   const directoriesToClean: { path: string; description: string }[] = [
//     { path: userDownloadsCapturesPath, description: 'capture downloads' },
//     {
//       path: userDownloadsSourceDomainFaviconsPath,
//       description: 'favicon downloads',
//     },
//   ];

//   for (const directory of directoriesToClean) {
//     if (fs.existsSync(directory.path) === false) {
//       logger.warn(
//         `The ${directory.description} directory does not exist to be cleaned`
//       );
//       continue;
//     }

//     fs.rmSync(directory.path, { recursive: true });
//     if (fs.existsSync(directory.path)) {
//       logger.error(`Failed to delete the ${directory.description} directory`);
//       return;
//     }

//     fs.mkdirSync(directory.path, { recursive: true });
//     if (fs.existsSync(directory.path) === false) {
//       logger.error(`Failed to recreate the ${directory.description} directory`);
//       return;
//     }

//     logger.info(`Successfully cleaned the ${directory.description} directory`);
//   }
// };

export default UtilityCleanAction;
