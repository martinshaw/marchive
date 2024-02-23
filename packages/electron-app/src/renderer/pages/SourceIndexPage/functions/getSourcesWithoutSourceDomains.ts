/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getSourcesWithoutSourceDomains.ts
Created:  2023-09-04T01:20:31.392Z
Modified: 2023-09-04T01:20:31.392Z

Description: description
*/

import { SourceEntityType } from 'common-types';

/**
 * @throws {string}
 */
const getSourcesWithoutSourceDomains = async (): Promise<
  SourceEntityType[]
> => {
  return new Promise((resolve, reject) => {
    // TODO: Need to re-implement this using the `sources:list` sub-command and the `--where-source-domain-eq-null`(?) flag

    // window.electron.ipcRenderer.once(
    //   'sources.list-without-source-domains',
    //   (sources, error) => {
    //     if (error != null) return reject(error);

    //     resolve(sources as SourceEntityType[]);
    //   }
    // );

    // window.electron.ipcRenderer.sendMessage('sources.list-without-source-domains');

    return resolve([] as SourceEntityType[]);
  });
};

export default getSourcesWithoutSourceDomains;
