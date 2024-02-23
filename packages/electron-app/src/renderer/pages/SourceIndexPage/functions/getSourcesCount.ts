/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getSourcesCount.ts
Created:  2023-09-04T01:20:31.392Z
Modified: 2023-09-04T01:20:31.392Z

Description: description
*/

/**
 * @throws {string}
 */
const getSourcesCount = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'sources.count',
      (count, error) => {
        if (error != null) return reject(error);

        resolve(count as number);
      }
    );

    window.electron.ipcRenderer.sendMessage('sources.count');
  })
}

export default getSourcesCount;
