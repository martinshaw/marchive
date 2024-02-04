/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getSources.ts
Created:  2023-09-04T01:20:31.392Z
Modified: 2023-09-04T01:20:31.392Z

Description: description
*/

import { SourceAttributes } from "database/src/models/Source";

/**
 * @throws {string}
 */
const getSources = async (): Promise<SourceAttributes[]> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'sources.list',
      (sources, error) => {
        if (error != null) return reject(error);

        resolve(sources as SourceAttributes[]);
      }
    );

    window.electron.ipcRenderer.sendMessage('sources.list');
  })
}

export default getSources;
