/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainRepository.ts
Created:  2023-09-04T19:15:37.840Z
Modified: 2023-09-04T19:15:37.840Z

Description: description
*/

import { downloadSourceDomainFaviconsPath } from "../../../paths";
import { SourceDomain } from "../../database"
import logger from "../../log";
import fs from 'node:fs'
import path from 'node:path'
// Uses my own type definitions below `GetWebsiteFaviconResultType` and `GetWebsiteFaviconResultIconType`
import getFavicons from 'get-website-favicon'
import Downloader from "nodejs-file-downloader";

export const findOrCreateSourceDomainForUrl = async (url: string): Promise<SourceDomain | null> => {
  let urlDomainName: string | null = null

  try {
    urlDomainName = new URL(url).hostname
    if (urlDomainName == null) {
      logger.warn('Empty URL domain parsed from URL: ' + url + ' when attempting to find or create source domain, setting to null')
      return null
    }
  } catch (error) {
    logger.warn('Unable to parse URL domain name from URL: ' + url + ' when attempting to find or create source domain, setting to null')
    return null
  }

  let sourceDomain: SourceDomain | null = null
  try {
    sourceDomain = await SourceDomain.findOne({ where: { name: urlDomainName } });
  } catch (error) {
    logger.error(`A DB error occurred when attempting to find SourceDomain with name ${urlDomainName}:`)
    logger.error(error)
  }

  if (sourceDomain != null) return sourceDomain

  const faviconPath = await retrieveAndStoreFaviconFromUrl(url)
  if (faviconPath == null || faviconPath === '') {
    logger.warn('Unable to retrieve favicon from URL: ' + url + ' when attempting to find or create source domain, setting to null')
    return null
  }

  return SourceDomain.create({
    name: urlDomainName,
    faviconPath,
  }).catch(error => {
    logger.error(`A DB error occurred when attempting to create SourceDomain with name ${urlDomainName}:`)
    logger.error(error)
    return null
  })
}

type GetWebsiteFaviconResultIconType = {
  src?: string;
  sizes?: string;
  type?: string;
  origin?: string;
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

const retrieveAndStoreFaviconFromUrl = async (url: string): Promise<string | null> => {
  if (fs.existsSync(downloadSourceDomainFaviconsPath) === false) fs.mkdirSync(downloadSourceDomainFaviconsPath, { recursive: true })

  const result = await getFavicons(url) as GetWebsiteFaviconResultType
  if (result.icons == null || result.icons.length === 0) return null


  // Prefer PNGs, then JPEGs, then SVGs, then ICOs
  const icon =
    result.icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.png') || icon.type === 'image/png')) ??
    result.icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.jpeg') || icon?.src?.endsWith('.jpg') || icon.type === 'image/jpeg')) ??
    result.icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.svg') || icon.type === 'image/svg+xml')) ??
    result.icons.find(icon => iconLikelyHasSuitableSize(icon) && (icon?.src?.endsWith('.ico') || icon.type === 'image/x-icon'))
  if (icon == null) return null

  const iconUrl = icon.src
  if (iconUrl == null) return null

  const iconUrlExtension = iconUrl.split('.').pop()
  const iconDownloader = new Downloader({
    url: iconUrl,
    directory: downloadSourceDomainFaviconsPath,
    fileName: new URL(url).hostname + '.' + iconUrlExtension,
  })

  try {
    await iconDownloader.download()
  }
  catch (error) {
    logger.error('Unable to download favicon from URL ' + iconUrl + ' for URL ' + url + ' due to error')
    logger.error(error)
    return null
  }

  return path.join(downloadSourceDomainFaviconsPath, new URL(url).hostname + '.' + iconUrlExtension)
}

