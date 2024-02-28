/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ImageFileDownloadDataProvider.ts
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

class ImageFileDownloadDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return "image-file-download";
  }

  getName(): string {
    return "Image File Download";
  }

  getDescription(): string {
    return "Downloads an image file";
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

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "tiff",
      "svg",
      "ico",
      "avif",
      "apng",
      "heif",
      "heic",
    ];

    const urlParts = url.split(".");
    const extension = urlParts[urlParts.length - 1];

    return imageExtensions.includes(extension.toLowerCase());
  }

  async allowedScheduleInterval(): Promise<AllowedScheduleIntervalReturnType> {
    return {};
  }

  async getSourceDomainInformation(
    url: string,
  ): Promise<SourceDomainInformationReturnType> {
    return super.getSourceDomainInformation(url);
  }

  /**
   * @throws {Error}
   */
  async performCapture(
    capture: Capture,
    schedule: Schedule,
    source: Source,
  ): Promise<boolean | never> {
    const url = source.url;
    const downloadLocation = capture.downloadLocation;

    if (!downloadLocation) {
      throw new Error("Download location not set");
    }

    return true;
  }

  /**
   * @throws {Error}
   */
  async processPart(capturePart: CapturePart): Promise<boolean | never> {
    return true;
  }
}

export default ImageFileDownloadDataProvider;
