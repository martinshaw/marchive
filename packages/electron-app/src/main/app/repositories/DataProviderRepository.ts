/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderRepository.ts
Created:  2023-08-02T02:43:55.200Z
Modified: 2023-08-02T02:43:55.200Z

Description: description
*/

import BaseDataProvider from '../data_providers/BaseDataProvider'
import BehanceGalleryItemImagesDataProvider from '../data_providers/BehanceGalleryItemImagesDataProvider'
import BlogArticleDataProvider from '../data_providers/BlogArticleDataProvider'
import PodcastRssFeedDataProvider from '../data_providers/PodcastRssFeedDataProvider'
import SimpleWebpageScreenshotDataProvider from '../data_providers/SimpleWebpageScreenshotDataProvider'
import WikipediaArticleDataProvider from '../data_providers/WikipediaArticleDataProvider'

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

export const getDataProviders = async (): Promise<BaseDataProvider[]> => {
  return dataProvidersClasses
}

export const getDataProviderByIdentifier: (
  identifier: string
) => Promise<BaseDataProvider | undefined> = async (identifier: string) => {
  return dataProvidersClasses.find(dataProvider => {
    return dataProvider.getIdentifier() === identifier
  })
}

export const validateUrlWithDataProviders: (
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
