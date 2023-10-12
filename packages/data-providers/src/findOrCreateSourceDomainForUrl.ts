/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: findOrCreateSourceDomainForUrl.ts
Created:  2023-10-11T22:46:44.883Z
Modified: 2023-10-11T22:46:44.883Z

Description: description
*/

import logger from "logger";
import { SourceDomain } from "database";
import BaseDataProvider from "./BaseDataProvider";

const findOrCreateSourceDomainForUrl = async (
  url: string,
  dataProvider: BaseDataProvider
): Promise<SourceDomain | null> => {
  let urlDomainName: string | null = null;
  try {
    const safeUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : "https://" + url;
    urlDomainName = new URL(safeUrl).hostname;
  } catch (error) {
    logger.warn(
      "Unable to parse URL domain name from URL: " +
        url +
        " when attempting to find or create source domain, setting to null"
    );
    return null;
  }

  if (urlDomainName == null) {
    logger.warn(
      "Empty URL domain parsed from URL: " +
        url +
        " when attempting to find or create source domain, setting to null"
    );
    return null;
  }

  let sourceDomain: SourceDomain | null = null;
  try {
    sourceDomain = await SourceDomain.findOne({
      where: { url: urlDomainName },
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to find SourceDomain with URL ${urlDomainName}:`
    );
    logger.error(error);
  }

  if (sourceDomain != null) return sourceDomain;

  const sourceDomainInformationFromDataProvider =
    await dataProvider.getSourceDomainInformation(url);
  const name =
    sourceDomainInformationFromDataProvider?.siteName != null
      ? sourceDomainInformationFromDataProvider.siteName
      : urlDomainName;

  return SourceDomain.create({
    url: urlDomainName,
    name,
    faviconPath: null,
  }).catch((error: Error | string) => {
    logger.error(
      `A DB error occurred when attempting to create SourceDomain with URL ${urlDomainName}:`
    );
    logger.error(error);
    return null;
  });
};

export default findOrCreateSourceDomainForUrl;
