/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreate.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import {
  BaseDataProvider,
  findOrCreateSourceDomainForUrl,
  getDataProviders,
  validateUrlWithDataProviders,
} from "data-providers";
import logger from "logger";
import { Source } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";

const SourceCreate = async (url: string, dataProviderIdentifier: string) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    url = url.trim();
    url =
      url.startsWith("http:") || url.startsWith("https:")
        ? url
        : "https://" + url;

    let existingSource: Source | null = null;
    try {
      existingSource = await Source.findOne({
        where: {
          url,
          dataProviderIdentifier,
        },
      });
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to check if an existing Source exists when creating a new Source for URL ${url} and Data Provider ${dataProviderIdentifier}`,
        error instanceof Error ? error : null,
      );
    }

    if (existingSource != null) {
      logger.info(
        `Source already exists with ID ${existingSource.id} for URL ${url} and Data Provider ${dataProviderIdentifier}, cancelling`,
      );

      throw new ErrorResponse(
        "You have already added this source. Please delete the existing source or make changes to it.",
      );
    }

    let validDataProvidersForUrl = await validateUrlWithDataProviders(url);
    if (validDataProvidersForUrl.length === 0) {
      throw new ErrorResponse(`No Data Providers available for ${url}`);
    }

    let chosenDataProvider: BaseDataProvider | null =
      validDataProvidersForUrl.find((dataProvider: BaseDataProvider) => {
        return dataProvider.getIdentifier() === dataProviderIdentifier;
      }) ?? null;

    if (chosenDataProvider == null) {
      throw new ErrorResponse(
        `The chosen data provider ${dataProviderIdentifier} is not available for the URL ${url}`,
        null,
        [
          {
            identifiers: (await getDataProviders()).map((dataProvider) =>
              dataProvider.getIdentifier(),
            ),
          },
        ],
      );
    }

    const sourceDomain = await findOrCreateSourceDomainForUrl(
      url,
      chosenDataProvider,
    );

    let source: Source | null = null;
    try {
      source = await Source.save({
        dataProviderIdentifier: chosenDataProvider.getIdentifier(),
        url,
        currentStartCursorUrl: null,
        currentEndCursorUrl: null,
        useStartOrEndCursor: null,
        sourceDomainId: sourceDomain == null ? null : sourceDomain.id,
      });
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to create a new Source for URL ${url}`,
        error instanceof Error ? error : null,
      );
    }

    return new MessageResponse(`Created new Source with ID ${source.id}`, [
      source,
    ]);
  });
};

export default SourceCreate;
