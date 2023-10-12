/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-11T18:10:49.687Z
Modified: 2023-10-11T18:10:49.687Z

Description: description
*/

import findOrCreateSourceDomainForUrl from './findOrCreateSourceDomainForUrl'
import retrieveAndStoreFaviconFromUrl, { FaviconIconType } from './retrieveAndStoreFaviconFromUrl'

import BaseDataProvider from './BaseDataProvider'
import BlogArticleDataProvider from './BlogArticleDataProvider'
import PodcastRssFeedDataProvider from './PodcastRssFeedDataProvider'
import WikipediaArticleDataProvider from './WikipediaArticleDataProvider'
import SimpleWebpageScreenshotDataProvider from './SimpleWebpageScreenshotDataProvider'
import BehanceGalleryItemImagesDataProvider from './BehanceGalleryItemImagesDataProvider'

/**
 * These Data Provider Classes should be ordered in increasing order of specificity
 *
 * For example, the SimpleWebpageScreenshotDataProvider is suitable for all webpages
 *   so it should be placed first above the BehanceGalleryItemImagesDataProvider
 *   which is only suitable for Behance Gallery Item pages
 *
 * Therefore, a user inputting a URL for a Behance Gallery Item page will be most
 *   likely to choose the BehanceGalleryItemImagesDataProvider
 *
 * These options are displayed in reverse order after being filtered by the
 *   validateUrlWithDataProviders function
 */
const dataProvidersClasses: BaseDataProvider[] = [
  new SimpleWebpageScreenshotDataProvider(),
  new BlogArticleDataProvider(),
  new PodcastRssFeedDataProvider(),
  new BehanceGalleryItemImagesDataProvider(),
  new WikipediaArticleDataProvider(),
]

const getDataProviders = async (): Promise<BaseDataProvider[]> => {
  return dataProvidersClasses
}

const getDataProviderByIdentifier: (
  identifier: string
) => Promise<BaseDataProvider | undefined> = async (identifier: string) => {
  return dataProvidersClasses.find(dataProvider => {
    return dataProvider.getIdentifier() === identifier
  })
}

const validateUrlWithDataProviders: (
  url: string
) => Promise<BaseDataProvider[]> = async (url: string) => {
  const dataProviders = await getDataProviders()

  const validDataProviderIdentifiers: BaseDataProvider[] = []

  for (let index = 0; index < dataProviders.length; index += 1) {
    const currentDataProvider: BaseDataProvider = dataProviders[index]

    if (await currentDataProvider.validateUrlPrompt(url)) {
      validDataProviderIdentifiers.push(currentDataProvider)
    }
  }

  return validDataProviderIdentifiers
}

export {
  getDataProviders,
  getDataProviderByIdentifier,
  validateUrlWithDataProviders,
  
  FaviconIconType,
  retrieveAndStoreFaviconFromUrl,
  
  findOrCreateSourceDomainForUrl,
}