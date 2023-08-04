/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceRepository.ts
Created:  2023-08-04T01:27:12.461Z
Modified: 2023-08-04T01:27:12.461Z

Description: description
*/

import { Source } from '../database';

// eslint-disable-next-line import/prefer-default-export
export const createSource: (
  sourceProviderIdentifier: string,
  url: string
) => Promise<Source> = async (
  sourceProviderIdentifier: string,
  url: string
) => {
  const source = await Source.create({
    source_provider_identifier: sourceProviderIdentifier,
    url,
  });

  return source;
};
