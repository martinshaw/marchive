/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getDataProviders.ts
Created:  2023-09-04T01:23:53.527Z
Modified: 2023-09-04T01:23:53.527Z

Description: description
*/

import { DataProviderSerializedType } from "main/app/providers/BaseDataProvider";

/**
 * @throws {string}
 */
const getDataProviders = async (): Promise<DataProviderSerializedType[]> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'providers.list',
      (dataProviders, error) => {
        if (error != null) return reject(error);

        resolve(dataProviders as DataProviderSerializedType[]);
      }
    );

    window.electron.ipcRenderer.sendMessage('providers.list');
  })
}

export default getDataProviders;
