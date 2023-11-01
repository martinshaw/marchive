/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SimpleWebpageScreenshotDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import path from "node:path";
import logger from "logger";
import { Browser, Page } from "puppeteer-core";
import { Capture, CapturePart, Schedule, Source } from "database";
import BaseDataProvider, {
  AllowedScheduleIntervalReturnType,
  BaseDataProviderIconInformationReturnType,
  SourceDomainInformationReturnType,
} from "../BaseDataProvider";
import {
  createPuppeteerBrowser,
  generatePageMetadata,
  generatePageScreenshot,
  loadPageByUrl,
} from "../helper_functions/PuppeteerDataProviderHelperFunctions";

class SimpleWebpageScreenshotDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return "simple-webpage-screenshot";
  }

  getName(): string {
    return "Simple Webpage Screenshot";
  }

  getDescription(): string {
    return "Captures a simple screenshot of a webpage";
  }

  getIconInformation(parentPath: string): BaseDataProviderIconInformationReturnType {
    return {
      filePath: path.join(parentPath, "page-layout.svg"),
      shouldInvertOnDarkMode: true,
    };
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith("http://") || url.startsWith("https://")) === false)
      url = `https://${url}`;

    let request: Response | null = null;
    try {
      request = await fetch(url);
      if (request === null) return false;
      if (request.status !== 200) return false;

      const contents = await request.text();
      if (!contents) return false;
      if (
        contents.includes("<body") === false &&
        contents.includes("<body>") === false
      )
        return false;
    } catch (error) {
      return false;
    }

    return true;
  }

  async allowedScheduleInterval(): Promise<AllowedScheduleIntervalReturnType> {
    return {};
  }

  async getSourceDomainInformation(
    url: string
  ): Promise<SourceDomainInformationReturnType> {
    return super.getSourceDomainInformation(url);

    /**
     * TODO: @see https://www.notion.so/codeatlas/Build-UI-etc-for-podcast-DP-2b11d20d72ec4c91be3033217034f020?pvs=4#de488f21490d4c6cb2ba70d0aa6a7970
     */
    // let request: Response | null = null;
    // try {
    //   request = await fetch(url);
    //   if (request === null) return super.getSourceDomainInformation(url);
    //   if (request.status !== 200) return super.getSourceDomainInformation(url);

    //   const contents = await request.text();
    //   if (!contents) return super.getSourceDomainInformation(url);
    //   if (
    //     contents.includes('<title ') === false &&
    //     contents.includes('<title>') === false
    //   ) {
    //     return super.getSourceDomainInformation(url);
    //   }

    //   let titleMatches;
    //   if ((titleMatches = /<title>([^<\/]*)<\/title>/iu.exec(contents)) !== null) {
    //     if (titleMatches.length < 2) return super.getSourceDomainInformation(url);

    //     const unescapedTitle = titleMatches[1];
    //     const title = entities.decodeHTML(unescapedTitle);

    //     return {
    //       siteName: title,
    //     }
    //   }
    // } catch (error) {
    //   return super.getSourceDomainInformation(url);
    // }

    // return super.getSourceDomainInformation(url);
  }

  /**
   * @throws {Error}
   */
  async performCapture(
    capture: Capture,
    schedule: Schedule,
    source: Source
  ): Promise<boolean | never> {
    const browser = await createPuppeteerBrowser();
    const page = await loadPageByUrl(source.url, browser);

    const firstPageScreenshot = await generatePageScreenshot(
      page,
      capture.downloadLocation
    );
    if (firstPageScreenshot === false) {
      const errorMessage = "The first page screenshot could not be generated";
      logger.error(errorMessage);

      await page.close();
      await browser.close();
      throw new Error(errorMessage);
    }

    const firstPageMetadata = await generatePageMetadata(
      page,
      capture.downloadLocation
    );
    if (firstPageMetadata === false) {
      const errorMessage = "The first page metadata could not be generated";
      logger.error(errorMessage);

      await page.close();
      await browser.close();
      throw new Error(errorMessage);
    }

    if (firstPageMetadata.title != null && firstPageMetadata.title !== "") {
      source.name = firstPageMetadata.title.toString();
      await source.save();
    }

    await page.close();
    await browser.close();

    return true;
  }

  /**
   * @throws {Error}
   */
  async processPart(capturePart: CapturePart): Promise<boolean | never> {
    return true;
  }
}

export default SimpleWebpageScreenshotDataProvider;
