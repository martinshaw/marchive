/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceProviderRepository.ts
Created:  2023-08-02T02:43:55.200Z
Modified: 2023-08-02T02:43:55.200Z

Description: description
*/

import RssFeedSourceProvider from '../providers/sources/RssFeedSourceProvider';
import SimpleWebpageSourceProvider from '../providers/sources/SimpleWebpageSourceProvider';
import SourceProvider from '../providers/sources/SourceProvider';

const sourceProvidersClasses: SourceProvider[] = [
  new SimpleWebpageSourceProvider(),
  new RssFeedSourceProvider(),
];

export const getSourceProviders = async () => {
  return sourceProvidersClasses;
};

export const getSourceProviderByIdentifier: (
  identifier: string
) => Promise<SourceProvider | undefined> = async (identifier: string) => {
  return sourceProvidersClasses.find((sourceProvider) => {
    return sourceProvider.getIdentifier() === identifier;
  });
};
