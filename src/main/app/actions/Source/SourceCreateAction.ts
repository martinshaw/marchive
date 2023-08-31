/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: list.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { validateUrlWithDataProviders } from '../../../app/repositories/DataProviderRepository'
import {Source} from '../../../database'
import logger from '../../../log'
import BaseDataProvider from '../../../app/providers/BaseDataProvider'
import { Attributes } from 'sequelize'

const SourceCreateAction = async (url: string, dataProviderIdentifier: string): Promise<Attributes<Source>> => {
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

  const source = await Source.create({
    dataProviderIdentifier: chosenDataProvider.getIdentifier(),
    url: url.toString(),
    currentStartCursorUrl: null,
    currentEndCursorUrl: null,
    useStartOrEndCursor: null,
  })

  logger.info(`Created new Source with ID ${source.id}`)

  return source.toJSON()
}

export default SourceCreateAction
