/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilityRetrieveFavicon.ts
Created:  2023-09-06T03:31:41.596Z
Modified: 2023-09-06T03:31:41.596Z

Description: description
*/
import logger from 'logger';
import { retrieveAndStoreFaviconFromUrl } from '../../../app/repositories/SourceDomainRepository'

/**
 * @throws {Error}
 */
const UtilityRetrieveFavicon = async (
  url: string
): Promise<string> => {
  let urlDomainName: string | null = null;
  try {
    const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url
    urlDomainName = (new URL(safeUrl)).hostname
  } catch (error) {
    const warningMessage = 'Unable to parse URL domain name from URL: ' + url + ' when attempting retrieve favicon for site in utility'
    logger.warn(warningMessage)
    throw new Error(warningMessage)
  }

  if (urlDomainName == null) {
    const warningMessage = 'Empty URL domain parsed from URL: ' + url + ' when attempting retrieve favicon for site in utility'
    logger.warn(warningMessage)
    throw new Error(warningMessage)
  }

  let faviconPath = await retrieveAndStoreFaviconFromUrl(url)
  if (faviconPath == null || faviconPath === '') {
    const warningMessage = 'Unable to retrieve favicon from URL: ' + url + ' when attempting retrieve favicon for site in utility'
    logger.warn(warningMessage)
    throw new Error(warningMessage)
  }

  return faviconPath
}

export default UtilityRetrieveFavicon
