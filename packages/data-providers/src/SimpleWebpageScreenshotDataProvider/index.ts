/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SimpleWebpageScreenshotDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import logger from "logger";
import { Capture, CapturePart, Schedule, Source } from "database";
import BaseDataProvider from "../BaseDataProvider";
import {
  createPuppeteerBrowser,
  generatePageMetadata,
  generatePageScreenshot,
  loadPageByUrl,
} from "../helper_functions/PuppeteerDataProviderHelperFunctions";
import axios, { AxiosResponse } from "axios";
import {
  type SourceDomainInformationReturnType,
  type BaseDataProviderIconInformationReturnType,
  type AllowedScheduleIntervalReturnType,
} from "common-types";

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

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    /**
     * I would prefer to use the svg-loader to load the actual file inline during webpack compilation,
     * but this would require adding webpack compilation to `data-providers` which adds unnecessary complexity.
     */
    return {
      filePath:
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE3LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAgMjAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8ZyBpZD0ibGF5b3V0XzRfIj4KCTxnPgoJCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTksMUgxQzAuNDUsMSwwLDEuNDUsMCwydjE2YzAsMC41NSwwLjQ1LDEsMSwxaDE4YzAuNTUsMCwxLTAuNDUsMS0xVjIKCQkJQzIwLDEuNDUsMTkuNTUsMSwxOSwxeiBNNywxN0gyVjhoNVYxN3ogTTE4LDE3SDhWOGgxMFYxN3ogTTE4LDdIMlYzaDE2Vjd6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==",
      shouldInvertOnDarkMode: true,
    };
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith("http://") || url.startsWith("https://")) === false)
      url = `https://${url}`;

    let response: AxiosResponse | null = null;
    try {
      response = await axios.get(url, { responseType: "document" });
      if (response === null) return false;
      if (response.status !== 200) return false;
      if ((response.headers["content-type"] !== "text/html") === false)
        return false;

      const contents = await response.data;
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
    url: string,
  ): Promise<SourceDomainInformationReturnType> {
    return super.getSourceDomainInformation(url);

    /**
     * @see https://www.notion.so/codeatlas/Build-UI-etc-for-podcast-DP-2b11d20d72ec4c91be3033217034f020?pvs=4#de488f21490d4c6cb2ba70d0aa6a7970
     */
    // let response: AxiosResponse | null = null;
    // try {
    //   response = await axios.get(url, {responseType: "document"});
    //   if (response === null) return super.getSourceDomainInformation(url);
    //   if (response.status !== 200) return super.getSourceDomainInformation(url);
    //   if ((response.headers["content-type"] !== "text/html") === false) return super.getSourceDomainInformation(url);

    //   const contents = await response.data;
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
    source: Source,
  ): Promise<boolean | never> {
    const browser = await createPuppeteerBrowser();
    const page = await loadPageByUrl(source.url, browser);

    const firstPageScreenshot = await generatePageScreenshot(
      page,
      capture.downloadLocation,
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
      capture.downloadLocation,
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
