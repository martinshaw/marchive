/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getSourceDomains.ts
Created:  2023-09-04T01:20:31.392Z
Modified: 2023-09-04T01:20:31.392Z

Description: description
*/

import { SourceDomainAttributes } from "../../../../main/database/models/SourceDomain";

/**
 * @throws {string}
 */
const getSourceDomains = async (withSources: boolean, withSourceSchedules: boolean): Promise<SourceDomainAttributes[]> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'source-domains.list',
      (sourceDomains, error) => {
        if (error != null) return reject(error);

        resolve(sourceDomains as SourceDomainAttributes[]);
      }
    );

    window.electron.ipcRenderer.sendMessage('source-domains.list', withSources, withSourceSchedules);
  })
}

export default getSourceDomains;
