/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { validateUrlWithDataProviders } from '../../../app/repositories/DataProviderRepository'
import {Source} from '../../../database'
import logger from '../../../log'
import BaseDataProvider from '../../data_providers/BaseDataProvider'
import { Attributes } from 'sequelize'
import { SourceAttributes, SourceUseStartOrEndCursorValueType } from '../../../database/models/Source'
import { findOrCreateSourceDomainForUrl } from '../../../app/repositories/SourceDomainRepository'

const SourceCreateAction = async (url: string, dataProviderIdentifier: string): Promise<SourceAttributes> => {
  let validDataProvidersForUrl = await validateUrlWithDataProviders(url)
  if (validDataProvidersForUrl.length === 0) {
    const errorMessage = `No Data Providers available for ${url}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  let chosenDataProvider: BaseDataProvider | null = validDataProvidersForUrl.find((dataProvider: BaseDataProvider) => {
    return dataProvider.getIdentifier() === dataProviderIdentifier
  }) ?? null

  if (chosenDataProvider == null) {
    const errorMessage = 'The chosen data provider ' + dataProviderIdentifier + ' is not available for the URL ' + url
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const sourceDomain = await findOrCreateSourceDomainForUrl(url)

  let source: Source | null = null
  try {
    source = await Source.create({
      dataProviderIdentifier: chosenDataProvider.getIdentifier(),
      url,
      currentStartCursorUrl: null,
      currentEndCursorUrl: null,
      useStartOrEndCursor: null as SourceUseStartOrEndCursorValueType,
      sourceDomainId: sourceDomain == null ? null : sourceDomain.id,
    })
  } catch (error) {
    logger.error(`A DB error occurred when attempting to create a new Source for URL ${url}`)
    logger.error(error)
    throw error
  }

  logger.info(`Created new Source with ID ${source.id}`)

  return source.toJSON()
}

export default SourceCreateAction
