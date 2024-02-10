/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: retrieveAndStoreFaviconFromUrl.ts
Created:  2023-10-11T22:33:12.418Z
Modified: 2023-10-11T22:33:12.418Z

Description: description
*/

import fs from "node:fs";
import logger from "logger";
import path from "node:path";
import { v4 as uuidV4 } from "uuid";
import Downloader from "nodejs-file-downloader";
import { resolveRelative, safeSanitizeFileName } from "utilities";
import { userDownloadsSourceDomainFaviconsPath } from "utilities";
import { retrieveFaviconsFromUrl } from "./helper_functions/PuppeteerDataProviderHelperFunctions";
import icoToPng from "ico-to-png";

export type FaviconIconType = {
  src?: string | null | undefined;
  sizes?: string;
  type?: string;
  origin?: string;
  rank?: number;
};

const iconLikelyHasSuitableSize = (icon: FaviconIconType): boolean => {
  const minimumSize = 120;

  // Check if `sizes` contains a size above the minimum
  const sizesRegex = /^([\d]+)x([\d]+)$/gm;
  let sizesMatches: RegExpExecArray | null = null;

  while ((sizesMatches = sizesRegex.exec(icon?.sizes || "")) !== null) {
    if (sizesMatches.index === sizesRegex.lastIndex) sizesRegex.lastIndex++;

    if (sizesMatches != null) {
      if (sizesMatches.length === 3) {
        const width = parseInt(sizesMatches[1]);
        const height = parseInt(sizesMatches[2]);
        if (width >= minimumSize && height >= minimumSize) return true;
        if (width < minimumSize && height < minimumSize) return false;
      }
    }
  }

  // Check if `src` contains a size above the minimum
  const srcRegex = /([\d]+)x([\d]+)/gm;
  let srcMatches: RegExpExecArray | null = null;

  while ((srcMatches = srcRegex.exec(icon?.sizes || "")) !== null) {
    if (srcMatches.index === srcRegex.lastIndex) srcRegex.lastIndex++;

    if (srcMatches != null) {
      if (srcMatches.length === 3) {
        const width = parseInt(srcMatches[1]);
        const height = parseInt(srcMatches[2]);
        if (width >= minimumSize && height >= minimumSize) return true;
        if (width < minimumSize && height < minimumSize) return false;
      }
    }
  }

  // If no sizes are specified in `sizes` or `src`, check if the icon is likely to be an 'apple-touch-icon' which is usually a nice relatively large icon
  if (
    icon?.origin?.includes(`rel="apple-touch-icon"`) ||
    icon?.origin?.includes(`rel='apple-touch-icon'`)
  )
    return true;
  if (icon?.src?.includes("apple_touch_icon.png")) return true;
  return false;
};

const retrieveAndStoreFaviconFromUrl = async (
  url: string,
  store: boolean = true,
): Promise<{
  url: string;
  directory: string | null;
  fileName: string | null;
  path: string | null;
} | null> => {
  if (fs.existsSync(userDownloadsSourceDomainFaviconsPath) === false)
    fs.mkdirSync(userDownloadsSourceDomainFaviconsPath, { recursive: true });

  let icons: FaviconIconType[] = await retrieveFaviconsFromUrl(url);
  if (icons.length === 0) return null;

  // Prefer PNGs, then JPEGs, then SVGs, then ICOs
  const icon =
    icons.find(
      (icon) =>
        iconLikelyHasSuitableSize(icon) &&
        (icon?.src?.endsWith(".png") || icon.type === "image/png"),
    ) ??
    icons.find(
      (icon) =>
        iconLikelyHasSuitableSize(icon) &&
        (icon?.src?.endsWith(".jpeg") ||
          icon?.src?.endsWith(".jpg") ||
          icon.type === "image/jpeg"),
    ) ??
    icons.find(
      (icon) =>
        iconLikelyHasSuitableSize(icon) &&
        (icon?.src?.endsWith(".svg") || icon.type === "image/svg+xml"),
    ) ??
    icons.find(
      (icon) => icon?.src?.endsWith(".ico") || icon.type === "image/x-icon",
    );

  let iconUrl: string | null | undefined = icon?.src ?? null;
  if (iconUrl == null) {
    if (icons.length > 0) {
      if (icons[0].src != null) {
        if (typeof icons[0].src === "string" && icons[0].src.trim() !== "") {
          iconUrl = icons[0].src.trim();
        } else return null;
      } else return null;
    } else return null;
  }

  if (typeof iconUrl === "string" && iconUrl.startsWith("//"))
    iconUrl = "https:" + iconUrl;
  if (typeof iconUrl === "string" && iconUrl.startsWith("/"))
    iconUrl = (resolveRelative(iconUrl, url) as string) || null;
  if (iconUrl == null || iconUrl === "") {
    logger.warn(
      "Unable to resolve relative URL for favicon URL " +
        iconUrl +
        " for URL " +
        url +
        " when attempting to retrieve and store favicon, setting to null",
    );
    return null;
  }

  const iconUrlExtension = iconUrl.split(".").pop();
  const safeUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : "https://" + url;
  let iconFileName = safeSanitizeFileName(
    new URL(safeUrl).hostname + "." + iconUrlExtension,
  );
  if (iconFileName === false)
    iconFileName = safeSanitizeFileName(uuidV4() + "." + iconUrlExtension);
  if (iconFileName === false) iconFileName = uuidV4() as string;

  if (store !== true) {
    return {
      url: iconUrl,
      directory: null,
      fileName: null,
      path: null,
    };
  }

  const iconDownloader = new Downloader({
    url: iconUrl,
    directory: userDownloadsSourceDomainFaviconsPath,
    fileName: iconFileName,
  });

  try {
    await iconDownloader.download();
  } catch (error) {
    logger.error(
      "Unable to download favicon from URL " +
        iconUrl +
        " for URL " +
        url +
        " due to error",
    );
    logger.error(error);
    return null;
  }

  // If the file is a .ico, convert it to a .png
  if (iconFileName.endsWith(".ico")) {
    const icoSource = fs.readFileSync(
      path.join(userDownloadsSourceDomainFaviconsPath, iconFileName),
    );

    const pngBuffer = await icoToPng(icoSource, 512);
    const pngFileName = iconFileName.replace(".ico", ".png");

    fs.writeFileSync(
      path.join(userDownloadsSourceDomainFaviconsPath, pngFileName),
      pngBuffer,
    );

    fs.unlinkSync(
      path.join(userDownloadsSourceDomainFaviconsPath, iconFileName),
    );

    iconFileName = pngFileName;
  }

  return {
    url: iconUrl,
    directory: userDownloadsSourceDomainFaviconsPath,
    fileName: iconFileName,
    path: path.join(userDownloadsSourceDomainFaviconsPath, iconFileName),
  };
};

export default retrieveAndStoreFaviconFromUrl;
