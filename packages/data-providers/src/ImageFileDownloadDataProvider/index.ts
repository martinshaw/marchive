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
  type SourceDomainInformationReturnType,
  type BaseDataProviderIconInformationReturnType,
  type AllowedScheduleIntervalReturnType,
} from "common-types";
import Downloader from "nodejs-file-downloader";
import { safeSanitizeFileName } from "common-functions";

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
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMi43MSA2LjI5YTEgMSAwIDAwLTEuNDIgMEwyMCA3LjU5VjJhMSAxIDAgMDAtMiAwdjUuNTlsLTEuMjktMS4zYTEgMSAwIDAwLTEuNDIgMS40MmwzIDNhMSAxIDAgMDAuMzMuMjEuOTQuOTQgMCAwMC43NiAwIDEgMSAwIDAwLjMzLS4yMWwzLTNhMSAxIDAgMDAwLTEuNDJ6TTE5IDEzYTEgMSAwIDAwLTEgMXYuMzhsLTEuNDgtMS40OGEyLjc5IDIuNzkgMCAwMC0zLjkzIDBsLS43LjctMi40OC0yLjQ4YTIuODUgMi44NSAwIDAwLTMuOTMgMEw0IDEyLjZWN2ExIDEgMCAwMTEtMWg4YTEgMSAwIDAwMC0ySDVhMyAzIDAgMDAtMyAzdjEyYTMgMyAwIDAwMyAzaDEyYTMgMyAwIDAwMy0zdi01YTEgMSAwIDAwLTEtMXpNNSAyMGExIDEgMCAwMS0xLTF2LTMuNTdsMi45LTIuOWEuNzkuNzkgMCAwMTEuMDkgMGwzLjE3IDMuMTcgNC4zIDQuM3ptMTMtMWEuODkuODkgMCAwMS0uMTguNTNMMTMuMzEgMTVsLjctLjdhLjc3Ljc3IDAgMDExLjEgMEwxOCAxNy4yMXoiLz48L3N2Zz4=",
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

    const endsWithImageExtension = imageExtensions.includes(
      extension.toLowerCase(),
    );

    if (endsWithImageExtension) return true;

    const imageExtensionsWithQuerySelector = imageExtensions.map(
      (extension) => `.${extension}?`,
    );

    return imageExtensionsWithQuerySelector.some((extension) =>
      url.includes(extension),
    );
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
    if (!capture.downloadLocation) {
      logger.error("Download location not set", {
        captureId: capture.id,
      });
      return false;
    }

    const fileName = safeSanitizeFileName(
      source.url.split("/").pop()?.split("?")[0] || "image.jpg",
    );
    if (!fileName) {
      logger.error("File name is not suitable", {
        captureId: capture.id,
        fileName,
      });
      return false;
    }

    const imageDownloader = new Downloader({
      url: source.url,
      directory: capture.downloadLocation,
      fileName,
    });

    try {
      await imageDownloader.download();
    } catch (error) {
      logger.error("Unable to download image due to error", {
        captureId: capture.id,
        url: source.url,
        directory: capture.downloadLocation,
        fileName,
      });
      logger.error(error);
      return false;
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
