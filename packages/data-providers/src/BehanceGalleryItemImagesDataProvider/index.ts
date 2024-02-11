/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-27T18:29:22.150Z
Modified: 2023-08-27T18:29:22.150Z

Description: description
*/

import fs from "node:fs";
import logger from "logger";
import BaseDataProvider from "../BaseDataProvider";
import path from "node:path";
import { v4 as uuidV4 } from "uuid";
import { ElementHandle, Page } from "puppeteer-core";
import Downloader from "nodejs-file-downloader";
import { Capture, CapturePart, Schedule, Source } from "database";
import {
  createPuppeteerBrowser,
  loadPageByUrl,
  retrievePageHeadMetadata,
} from "../helper_functions/PuppeteerDataProviderHelperFunctions";
import { checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl } from "../helper_functions/CapturePartHelperFunctions";
import axios, { AxiosResponse } from "axios";
import {
  type AllowedScheduleIntervalReturnType,
  type BaseDataProviderIconInformationReturnType,
  type SourceDomainInformationReturnType,
} from "common-types";

type BehanceGalleryItemImagesDataProviderImageType = {
  url: string;
  caption: string | null;
};

type BehanceGalleryItemImagesDataProviderImagePayloadType = {
  index: number;
} & BehanceGalleryItemImagesDataProviderImageType;

type BehanceGalleryItemImagesDataProviderPartIdentifierType = "image";

class BehanceGalleryItemImagesDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return "behance-gallery-item-images";
  }

  getName(): string {
    return "Images from a Behance gallery project page";
  }

  getDescription(): string {
    return "Captures all images, tags, comments and metadata from a Behance gallery project page";
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTIyIDdoLTdWNWg3djJ6bTEuNzI2IDEwYy0uNDQyIDEuMjk3LTIuMDI5IDMtNS4xMDEgMy0zLjA3NCAwLTUuNTY0LTEuNzI5LTUuNTY0LTUuNjc1IDAtMy45MSAyLjMyNS01LjkyIDUuNDY2LTUuOTIgMy4wODIgMCA0Ljk2NCAxLjc4MiA1LjM3NSA0LjQyNi4wNzguNTA2LjEwOSAxLjE4OC4wOTUgMi4xNEgxNS45N2MuMTMgMy4yMTEgMy40ODMgMy4zMTIgNC41ODggMi4wMjloMy4xNjh6bS03LjY4Ni00aDQuOTY1Yy0uMTA1LTEuNTQ3LTEuMTM2LTIuMjE5LTIuNDc3LTIuMjE5LTEuNDY2IDAtMi4yNzcuNzY4LTIuNDg4IDIuMjE5em0tOS41NzQgNi45ODhIMFY1LjAyMWg2Ljk1M2M1LjQ3Ni4wODEgNS41OCA1LjQ0NCAyLjcyIDYuOTA2IDMuNDYxIDEuMjYgMy41NzcgOC4wNjEtMy4yMDcgOC4wNjF6TTMgMTFoMy41ODRjMi41MDggMCAyLjkwNi0zLS4zMTItM0gzdjN6bTMuMzkxIDNIM3YzLjAxNmgzLjM0MWMzLjA1NSAwIDIuODY4LTMuMDE2LjA1LTMuMDE2eiIvPjwvc3ZnPg==",
      shouldInvertOnDarkMode: false,
    };
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith("http://") || url.startsWith("https://")) === false)
      url = `https://${url}`;

    if (
      url.startsWith("https://www.behance.net/gallery/") === false &&
      url.startsWith("https://www.behance.net/gallery/") === false
    )
      return false;

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
    // There is no need to re-capture this page and page's image data, because it is unlikely to ever change / to be added to
    return {
      onlyRunOnce: true,
    };
  }

  async getSourceDomainInformation(
    url: string,
  ): Promise<SourceDomainInformationReturnType> {
    return {
      siteName: "Behance Projects",
    };
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

    const indexPageDownloadFileName = path.join(
      capture.downloadLocation,
      "screenshot.jpg",
    );

    await page.screenshot({
      fullPage: true,
      path: indexPageDownloadFileName,
      quality: 90,
      type: "jpeg",
    });

    await this.generatePageHeadMetadata(page, capture.downloadLocation);

    const projectMetadata = await this.generatePageProjectMetadata(
      page,
      capture.downloadLocation,
    );
    if (projectMetadata === false) {
      await page.close();
      await browser.close();

      throw new Error("Failed to generate project metadata");
    }
    if (projectMetadata.title != null && projectMetadata.title !== "") {
      source.name = projectMetadata.title.toString();
      await source.save();
    }

    const pageImages = await this.determineAllImages(page);

    try {
      await this.createCapturePartsForImages(
        schedule,
        capture,
        source,
        pageImages,
      );
    } catch (error) {
      await page.close();
      await browser.close();

      throw error;
    }

    await page.close();
    await browser.close();

    return true;
  }

  async generatePageHeadMetadata(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    const headMetadataFileName = path.join(
      captureDownloadDirectory,
      "metadata.json",
    );

    const headMetadata = await retrievePageHeadMetadata(page);
    fs.writeFileSync(headMetadataFileName, JSON.stringify(headMetadata));

    return fs.existsSync(headMetadataFileName);
  }

  async generatePageProjectMetadata(
    page: Page,
    captureDownloadDirectory: string,
    // ): Promise<false | JSONObject> {
  ): Promise<false | any> {
    const projectMetadataFileName = path.join(
      captureDownloadDirectory,
      "project.json",
    );

    // const projectMetadata: JSONObject = {};
    const projectMetadata: any = {};

    const textContentSelectors = [
      {
        selector: '[class*="Project-main-"] [class*="Project-title-"]',
        key: "title",
      },
    ];

    textContentSelectors.forEach(async ({ selector, key }) => {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      const value = await page.evaluate<
        [ElementHandle<Element> | null],
        (elementHandle: Element | null) => string | null
      >((elementHandle) => elementHandle?.textContent ?? null, element);
      projectMetadata[key] = value ?? null;
    });

    const authorItemsSelector =
      '[class*="ProjectInfo-sideBar"] [class*="ProjectInfo-profileInfo"]:first-child [class*="UserInfo-individualProfile-"]';
    await page.waitForSelector(authorItemsSelector);
    const authorHandles = await page.$$(authorItemsSelector);
    const authorsData: {
      avatarImageUrl: string | null;
      name: string | null;
      url: string | null;
      locationName: string | null;
      locationUrl: string | null;
    }[] = await Promise.all(
      authorHandles.map(async (authorHandle) =>
        page.evaluate<
          [ElementHandle<Element>],
          (elementHandle: Element) => {
            avatarImageUrl: string | null;
            name: string | null;
            url: string | null;
            locationName: string | null;
            locationUrl: string | null;
          }
        >((elementHandle) => {
          return {
            avatarImageUrl:
              elementHandle
                ?.querySelector('[class*="UserInfo-userAvatar-"] img')
                ?.getAttribute("src") ?? null,
            name:
              elementHandle?.querySelector('a[class*="UserInfo-userName"]')
                ?.textContent ?? null,
            url:
              elementHandle
                ?.querySelector('a[class*="UserInfo-userName"]')
                ?.getAttribute("href") ?? null,
            locationName:
              elementHandle?.querySelector('a[class*="UserInfo-userLocation"]')
                ?.textContent ?? null,
            locationUrl:
              elementHandle
                ?.querySelector('a[class*="UserInfo-userLocation"]')
                ?.getAttribute("href") ?? null,
          };
        }, authorHandle),
      ),
    );
    projectMetadata.authors = authorsData;

    const commentItemsSelector =
      '[class*="ProjectComments-projectComment-"] ul li';
    await page.waitForSelector(commentItemsSelector);
    const commentHandles = await page.$$(commentItemsSelector);
    const commentsData: {
      avatarImageUrl: string | null;
      authorName: string | null;
      authorUrl: string | null;
      content: string | null;
    }[] = await Promise.all(
      commentHandles.map(async (commentHandle) =>
        page.evaluate<
          [ElementHandle<HTMLLIElement>],
          (elementHandle: HTMLLIElement) => {
            avatarImageUrl: string | null;
            authorName: string | null;
            authorUrl: string | null;
            content: string | null;
          }
        >((elementHandle) => {
          return {
            avatarImageUrl:
              elementHandle
                ?.querySelector('[class*="ProjectComment-avatar-"] img')
                ?.getAttribute("src") ?? null,
            authorName:
              elementHandle?.querySelector(
                'a[class*="ProjectComment-userName-"]',
              )?.textContent ?? null,
            authorUrl:
              elementHandle
                ?.querySelector('a[class*="ProjectComment-userName-"]')
                ?.getAttribute("href") ?? null,
            content:
              elementHandle?.querySelector('[class*="ProjectComment-comment-"]')
                ?.textContent ?? null,
          };
        }, commentHandle),
      ),
    );
    projectMetadata.comments = commentsData;

    const tagItemsSelector = 'ul[class*="ProjectTags-projectTags-"] li';
    await page.waitForSelector(tagItemsSelector);
    const tagHandles = await page.$$(tagItemsSelector);
    const tagsData: {
      url: string | null;
      caption: string | null;
    }[] = await Promise.all(
      tagHandles.map(async (tagHandle) =>
        page.evaluate<
          [ElementHandle<HTMLLIElement>],
          (elementHandle: HTMLLIElement) => {
            url: string | null;
            caption: string | null;
          }
        >((elementHandle) => {
          return {
            url:
              elementHandle?.querySelector("a")?.getAttribute("href") ?? null,
            caption: elementHandle?.querySelector("a")?.textContent ?? null,
          };
        }, tagHandle),
      ),
    );
    projectMetadata.tags = tagsData;

    fs.writeFileSync(projectMetadataFileName, JSON.stringify(projectMetadata));

    return fs.existsSync(projectMetadataFileName) ? projectMetadata : false;
  }

  async determineAllImages(
    page: Page,
  ): Promise<BehanceGalleryItemImagesDataProviderImageType[]> {
    const imageHandles = await page.$$("#primary-project-content img");

    const images: BehanceGalleryItemImagesDataProviderImageType[] =
      await Promise.all(
        imageHandles.map(async (image) => {
          return {
            url: (await (await image?.getProperty("src"))?.jsonValue()) ?? "",
            caption:
              (await (await image?.getProperty("alt"))?.jsonValue()) ?? null,
          };
        }),
      );

    return new Promise((resolve) => {
      resolve(
        images
          .map((image) => {
            if (image.url === "") return null;
            if (
              image.url.startsWith("http://") === false &&
              image.url.startsWith("https://") === false
            )
              return null;

            if (image.url.includes("#")) {
              const urlWithoutHash = image.url.split("#")[0];
              if (
                images.some((otherImage) => otherImage.url === urlWithoutHash)
              )
                return null;
              return {
                ...image,
                url: urlWithoutHash,
              } as BehanceGalleryItemImagesDataProviderImageType;
            }

            return image as BehanceGalleryItemImagesDataProviderImageType;
          })
          .filter(
            (image) => image !== null,
          ) as BehanceGalleryItemImagesDataProviderImageType[],
      );
    });
  }

  /**
   * @throws {Error}
   */
  async createCapturePartsForImages(
    schedule: Schedule,
    capture: Capture,
    source: Source,
    images: BehanceGalleryItemImagesDataProviderImageType[],
  ): Promise<void | never> {
    let shouldAddImage = true;
    if (
      source.useStartOrEndCursor === "start" &&
      source.currentStartCursorUrl != null
    )
      shouldAddImage = false;

    let countOfAddedCaptureParts = 0;

    const addCapturePart = async (
      image: BehanceGalleryItemImagesDataProviderImageType,
      index: number,
    ): Promise<boolean> => {
      if (source.useStartOrEndCursor == null) {
        if (
          await checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl(
            schedule,
            image.url,
          )
        )
          return true;
      }

      if (
        source.useStartOrEndCursor === "start" &&
        source?.currentStartCursorUrl === image.url
      ) {
        shouldAddImage = false;
        return false;
      }

      if (
        source.useStartOrEndCursor === "end" &&
        source?.currentEndCursorUrl === image.url
      ) {
        shouldAddImage = true;
        return true;
      }

      if (shouldAddImage) {
        const payload: BehanceGalleryItemImagesDataProviderImagePayloadType = {
          index,
          ...image,
        };
        const downloadLocation = path.join(capture.downloadLocation, uuidV4());

        let capturePart: CapturePart | null = null;
        try {
          capturePart = await CapturePart.save({
            status: "pending",
            url: image.url,
            dataProviderPartIdentifier:
              "image" as BehanceGalleryItemImagesDataProviderPartIdentifierType,
            payload: JSON.stringify(payload),
            downloadLocation,
            capture,
          });
        } catch (error) {
          logger.error("A DB error occurred when creating a new Capture Part");
          logger.error(error);
        }

        if (capturePart === null) {
          logger.error(
            `Capture Part ${index} could not be created: ${image.url}`,
          );
          return true;
        }

        countOfAddedCaptureParts += 1;
      }

      return true;
    };

    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const shouldContinue = await addCapturePart(image, index);
      if (shouldContinue === false) break;
    }

    if (source.useStartOrEndCursor === "start")
      source.currentStartCursorUrl = images[0].url;
    if (source.useStartOrEndCursor === "end")
      source.currentEndCursorUrl = images[images.length - 1].url;
    await source.save();

    logger.info(`Added ${countOfAddedCaptureParts} Capture Parts`);
  }

  /**
   * @throws {Error}
   */
  async processPart(capturePart: CapturePart): Promise<boolean | never> {
    switch (capturePart.dataProviderPartIdentifier) {
      case "image":
        return this.processImageCapturePart(capturePart);
      default:
        return false;
    }
  }

  /**
   * @throws {Error}
   */
  async processImageCapturePart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    const payload: BehanceGalleryItemImagesDataProviderImagePayloadType =
      JSON.parse(capturePart.payload);
    if (payload.url == null || payload.url === "") return false;

    if (
      capturePart?.capture?.downloadLocation == null ||
      capturePart?.capture?.downloadLocation === "" ||
      capturePart.downloadLocation == null ||
      capturePart.downloadLocation === ""
    ) {
      const errorMessage = `No download location found for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (fs.existsSync(capturePart.downloadLocation) !== true)
      fs.mkdirSync(capturePart.downloadLocation, { recursive: true });

    if (fs.lstatSync(capturePart.downloadLocation).isDirectory() === false) {
      const errorMessage = `Download destination '${capturePart.downloadLocation}' is not a directory`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if ((await this.downloadImageMediaFile(capturePart, payload)) === false) {
      const errorMessage = `Failed to download podcast item media file for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  }

  /**
   * @throws {Error}
   */
  async downloadImageMediaFile(
    capturePart: CapturePart,
    payload: BehanceGalleryItemImagesDataProviderImagePayloadType,
  ): Promise<boolean | never> {
    if (payload.url == null || (payload.url ?? "").trim() === "") return false;

    const downloader = new Downloader({
      url: payload.url,
      directory: capturePart.downloadLocation,
    });

    try {
      const { filePath, downloadStatus } = await downloader.download();
    } catch (error) {
      const errorMessage = `Failed to download image media file for Capture Part ${payload.index} from ${payload.url}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  }
}

export default BehanceGalleryItemImagesDataProvider;
