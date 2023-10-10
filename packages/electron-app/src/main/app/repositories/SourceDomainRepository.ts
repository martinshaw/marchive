/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainRepository.ts
Created:  2023-09-04T19:15:37.840Z
Modified: 2023-09-04T19:15:37.840Z

Description: description
*/

import fs from 'node:fs';
import { v4 } from "uuid";
import logger from 'logger';
import path from 'node:path';
import { SourceDomain } from "database";
import Downloader from "nodejs-file-downloader";
import { safeSanitizeFileName } from 'utilities';
import resolveRelative from 'resolve-relative-url';
import BaseDataProvider from "../data_providers/BaseDataProvider";
import { downloadSourceDomainFaviconsPath } from "../../../paths";
// // Uses my own type definitions below `GetWebsiteFaviconResultType` and `GetWebsiteFaviconResultIconType`
// import getFavicons from 'get-website-favicon'
import { createPuppeteerBrowser, loadPageByUrl, retrieveFaviconsFromUrl as retrieveFaviconsFromUrlUsingPuppeteer, retrievePageHeadMetadata } from "../data_providers/helper_functions/PuppeteerDataProviderHelperFunctions";

export const findOrCreateSourceDomainForUrl = async (url: string, dataProvider: BaseDataProvider): Promise<SourceDomain | null> => {
  let urlDomainName: string | null = null;
  try {
    const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url
    urlDomainName = (new URL(safeUrl)).hostname
  } catch (error) {
    logger.warn('Unable to parse URL domain name from URL: ' + url + ' when attempting to find or create source domain, setting to null')
    return null
  }

  if (urlDomainName == null) {
    logger.warn('Empty URL domain parsed from URL: ' + url + ' when attempting to find or create source domain, setting to null')
    return null
  }

  let sourceDomain: SourceDomain | null = null
  try {
    sourceDomain = await SourceDomain.findOne({ where: { url: urlDomainName } });
  } catch (error) {
    logger.error(`A DB error occurred when attempting to find SourceDomain with URL ${urlDomainName}:`)
    logger.error(error)
  }

  if (sourceDomain != null) return sourceDomain

  /**
   * TODO: Because the `get-website-favicon` package doesn't seem to be able to find favicons for some sites, and because my own
   *   implementation takes way too long to load the browser, the page and then to wait,
   *   we'll just set the favicon to null for now
   */
  // let faviconPath = await retrieveAndStoreFaviconFromUrl(url)
  // if (faviconPath == null || faviconPath === '') {
    // logger.warn('Unable to retrieve favicon from URL: ' + url + ' when attempting to find or create source domain, setting to null')
    const faviconPath = null
  // }


  const sourceDomainInformationFromDataProvider = await dataProvider.getSourceDomainInformation(url)
  const name = sourceDomainInformationFromDataProvider?.siteName != null ? sourceDomainInformationFromDataProvider.siteName: urlDomainName

  return SourceDomain.create({
    name,
    url: urlDomainName,
    faviconPath,
  }).catch((error: Error | string) => {
    logger.error(`A DB error occurred when attempting to create SourceDomain with URL ${urlDomainName}:`)
    logger.error(error)
    return null
  })
}

type GetWebsiteFaviconResultIconType = {
  src?: string;
  sizes?: string;
  type?: string;
  origin?: string;
  rank?: number;
}

export type GetWebsiteFaviconResultIconTypeWithNonUnknownSrc = GetWebsiteFaviconResultIconType & {
  src: string;
}

type GetWebsiteFaviconResultType = {
  url?: string;
  baseUrl?: string;
  originUrl?: string;
  icons?: GetWebsiteFaviconResultIconType[];
}

const iconLikelyHasSuitableSize = (icon: GetWebsiteFaviconResultIconType): boolean => {
  const minimumSize = 120

  // Check if `sizes` contains a size above the minimum
  const sizesRegex = /^([\d]+)x([\d]+)$/gm;
  let sizesMatches: RegExpExecArray | null = null;

  while ((sizesMatches = sizesRegex.exec(icon?.sizes || '')) !== null) {
    if (sizesMatches.index === sizesRegex.lastIndex) sizesRegex.lastIndex++;

    if (sizesMatches != null) {
      if (sizesMatches.length === 3) {
        const width = parseInt(sizesMatches[1])
        const height = parseInt(sizesMatches[2])
        if (width >= minimumSize && height >= minimumSize) return true
        if (width < minimumSize && height < minimumSize) return false
      }
    }
  }

  // Check if `src` contains a size above the minimum
  const srcRegex = /([\d]+)x([\d]+)/gm;
  let srcMatches: RegExpExecArray | null = null;

  while ((srcMatches = srcRegex.exec(icon?.sizes || '')) !== null) {
    if (srcMatches.index === srcRegex.lastIndex) srcRegex.lastIndex++;

    if (srcMatches != null) {
      if (srcMatches.length === 3) {
        const width = parseInt(srcMatches[1])
        const height = parseInt(srcMatches[2])
        if (width >= minimumSize && height >= minimumSize) return true
        if (width < minimumSize && height < minimumSize) return false
      }
    }
  }

  // If no sizes are specified in `sizes` or `src`, check if the icon is likely to be an 'apple-touch-icon' which is usually a nice relatively large icon
  if (icon?.origin?.includes(`rel="apple-touch-icon"`) || icon?.origin?.includes(`rel='apple-touch-icon'`)) return true
  if (icon?.src?.includes('apple_touch_icon.png')) return true
  return false
}

export const retrieveAndStoreFaviconFromUrl = async (url: string): Promise<string | null> => {
  if (fs.existsSync(downloadSourceDomainFaviconsPath) === false) fs.mkdirSync(downloadSourceDomainFaviconsPath, { recursive: true })

  /**
   * This doesn't seem to work as expected for some sites, so we'll use my own Puppeteer-based favicon code below instead, even though it's much slower
   *   TODO: Will need to find an alternative to speed up the process of adding a new Source with a new Source Domain
   */
  // const result = await getFavicons(url) as GetWebsiteFaviconResultType

  let icons: GetWebsiteFaviconResultIconTypeWithNonUnknownSrc[] = []
  // if (result.icons == null || result.icons.length === 0) {
    /**
     * The `get-website-favicon` package doesn't seem to be able to find favicons for some sites
     *   (I suspect sites which are dynamically JS rendered on page load), so we'll try to use
     *   my own Puppeteer-based favicon code get the favicon (this takes much longer because
     *   it has to load the browser, the page and then to wait)
     */
    icons = await retrieveFaviconsFromUrlUsingPuppeteer(url)
    if (icons.length === 0) return null
  // } else {
  //   icons = result.icons.filter(i => i?.src != null && i?.src !== '') as GetWebsiteFaviconResultIconTypeWithNonUnknownSrc[]
  // }

  // Prefer PNGs, then JPEGs, then SVGs, then ICOs
  const icon =
    icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.png') || icon.type === 'image/png')) ??
    icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.jpeg') || icon?.src?.endsWith('.jpg') || icon.type === 'image/jpeg')) ??
    icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.svg') || icon.type === 'image/svg+xml')) ??
    icons.find(icon => (icon?.src?.endsWith('.ico') || icon.type === 'image/x-icon'))

  let iconUrl: string | null = icon?.src ?? null
  if (iconUrl == null) {
    if (icons.length > 0) iconUrl = icons[0].src
    else return null
  }

  if (iconUrl.startsWith('//')) iconUrl = 'https:' + iconUrl
  if (iconUrl.startsWith('/')) iconUrl = resolveRelative(iconUrl, url) as string || null
  if (iconUrl == null) {
    logger.warn('Unable to resolve relative URL for favicon URL ' + iconUrl + ' for URL ' + url + ' when attempting to retrieve and store favicon, setting to null')
    return null
  }

  const iconUrlExtension = iconUrl.split('.').pop()
  const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url
  let iconFileName = safeSanitizeFileName((new URL(safeUrl)).hostname + '.' + iconUrlExtension)
  if (iconFileName === false) iconFileName = safeSanitizeFileName(v4() + '.' + iconUrlExtension)
  if (iconFileName === false) iconFileName = v4() as string

  const iconDownloader = new Downloader({
    url: iconUrl,
    directory: downloadSourceDomainFaviconsPath,
    fileName: iconFileName,
  })

  try { await iconDownloader.download() }
  catch (error) {
    logger.error('Unable to download favicon from URL ' + iconUrl + ' for URL ' + url + ' due to error')
    logger.error(error)
    return null
  }

  return path.join(downloadSourceDomainFaviconsPath, iconFileName)
}

