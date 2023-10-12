/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import {
  validateUrlWithDataProviders,
  findOrCreateSourceDomainForUrl,
} from 'data-providers';
import logger from 'logger';
import {
  SourceAttributes,
  SourceUseStartOrEndCursorValueType,
} from 'database/src/models/Source';
import { Source, Op } from 'database';
import BaseDataProvider from 'data-providers/src/BaseDataProvider';

const SourceCreateAction = async (
  url: string,
  dataProviderIdentifier: string
): Promise<SourceAttributes> => {
  url = url.trim();
  url =
    url.startsWith('http:') || url.startsWith('https:')
      ? url
      : 'https://' + url;

  let existingSource: Source | null = null;
  try {
    existingSource = await Source.findOne({
      where: {
        url: { [Op.eq]: url },
        dataProviderIdentifier: { [Op.eq]: dataProviderIdentifier },
      },
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to check if an existing Source exists when creating a new Source for URL ${url} and Data Provider ${dataProviderIdentifier}`
    );
    logger.error(error);
    throw error;
  }

  if (existingSource != null) {
    logger.info(
      `Source already exists with ID ${existingSource.id} for URL ${url} and Data Provider ${dataProviderIdentifier}, cancelling`
    );

    const friendlyInfoMessage =
      'You have already added this source. Please delete the existing source or make changes to it.';
    throw new Error(friendlyInfoMessage);
  }

  let validDataProvidersForUrl = await validateUrlWithDataProviders(url);
  if (validDataProvidersForUrl.length === 0) {
    const errorMessage = `No Data Providers available for ${url}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  let chosenDataProvider: BaseDataProvider | null =
    validDataProvidersForUrl.find((dataProvider: BaseDataProvider) => {
      return dataProvider.getIdentifier() === dataProviderIdentifier;
    }) ?? null;

  if (chosenDataProvider == null) {
    const errorMessage =
      'The chosen data provider ' +
      dataProviderIdentifier +
      ' is not available for the URL ' +
      url;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  const sourceDomain = await findOrCreateSourceDomainForUrl(
    url,
    chosenDataProvider
  );

  let source: Source | null = null;
  try {
    source = await Source.create({
      dataProviderIdentifier: chosenDataProvider.getIdentifier(),
      url,
      currentStartCursorUrl: null,
      currentEndCursorUrl: null,
      useStartOrEndCursor: null as SourceUseStartOrEndCursorValueType,
      sourceDomainId: sourceDomain == null ? null : sourceDomain.id,
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to create a new Source for URL ${url}`
    );
    logger.error(error);
    throw error;
  }

  logger.info(`Created new Source with ID ${source.id}`);

  return source.toJSON();
};

export default SourceCreateAction;
