/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-10-11T22:14:15.995Z
Modified: 2023-10-11T22:14:15.995Z

Description: description
*/

import path from "node:path";
import fs from "node:fs";
import logger from "logger";
import {
  Browser as BrowserEnum,
  computeExecutablePath,
  detectBrowserPlatform,
} from "@puppeteer/browsers";

// @ts-ignore
const isRunningPackaged: boolean = typeof process.pkg !== "undefined";

const readOnlyChromiumExecutablePath: string | false = (() => {
  const puppeteerBrowsersRootDirectory = isRunningPackaged
    ? path.join(process.execPath, "..", "chromium")
    : path.join(__dirname, "..", "..", "data-providers", "chromium");

  const puppeteerBrowsersRootDirectoryContents = fs
    .readdirSync(puppeteerBrowsersRootDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory());

  let installedBrowserVersion: string | null = null;

  if (puppeteerBrowsersRootDirectoryContents.length < 1) {
    logger.error('Could not find an installed browser for "puppeteer"', {
      browsersRoot: puppeteerBrowsersRootDirectory,
    });

    return false;
  }

  const installedBrowserVersionRegexMatches =
    puppeteerBrowsersRootDirectoryContents[0].name.match(
      "" + detectBrowserPlatform() + "-(.*)"
    );
  if (
    installedBrowserVersionRegexMatches === null ||
    installedBrowserVersionRegexMatches?.length !== 2
  ) {
    logger.error(
      'Could not determine the installed browser version for "puppeteer"',
      {
        browsersRoot: puppeteerBrowsersRootDirectory,
        name: puppeteerBrowsersRootDirectoryContents[0].name,
        path: puppeteerBrowsersRootDirectoryContents[0].path,
      }
    );

    return false;
  }

  installedBrowserVersion = installedBrowserVersionRegexMatches[1];
  if (installedBrowserVersion === null) {
    logger.error(
      'Could not determine the installed browser version for "puppeteer" (due to regex)',
      {
        browsersRoot: puppeteerBrowsersRootDirectory,
        name: puppeteerBrowsersRootDirectoryContents[0].name,
        path: puppeteerBrowsersRootDirectoryContents[0].path,
      }
    );

    return false;
  }

  return computeExecutablePath({
    cacheDir: path.join(puppeteerBrowsersRootDirectory, ".."),
    browser: BrowserEnum.CHROMIUM,
    buildId: installedBrowserVersion,
    platform: detectBrowserPlatform(),
  });
})();

const readOnlyBrowserExtensionsPath = isRunningPackaged
  ? path.join(process.execPath, "..", "browser_extensions")
  : path.join(
      __dirname,
      "..",
      "..",
      "data-providers",
      "src",
      "browser_extensions"
    );

export { readOnlyChromiumExecutablePath, readOnlyBrowserExtensionsPath };
