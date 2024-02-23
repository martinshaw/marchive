/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getSource.ts
Created:  2023-09-11T12:35:33.900Z
Modified: 2023-09-11T12:35:33.900Z

Description: description
*/

import SourceEntityType from 'common-types/src/entities/Source';

/**
 * @throws {string}
 */
const getSource = async (
  sourceId: number | null = null,
  withSourceDomain: boolean = false,
  withSchedules: boolean = false,
  withCaptures: boolean = false,
): Promise<SourceEntityType> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once('sources.show', (source, error) => {
      if (error != null) return reject(error);

      resolve(source as SourceEntityType);
    });

    window.electron.ipcRenderer.sendMessage(
      'sources.show',
      sourceId,
      withSourceDomain,
      withSchedules,
      withCaptures,
    );
  });
};

export default getSource;
