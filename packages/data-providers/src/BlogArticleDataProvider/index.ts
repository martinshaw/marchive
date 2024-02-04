/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BlogArticleDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import fs from "node:fs";
import logger from "logger";
import BaseDataProvider, {
  AllowedScheduleIntervalReturnType,
  BaseDataProviderIconInformationReturnType,
  SourceDomainInformationReturnType,
} from "../BaseDataProvider";
import path from "node:path";
import { v4 as uuidV4 } from "uuid";
import { Page } from "puppeteer-core";
import { safeSanitizeFileName } from "utilities";
import {
  createPuppeteerBrowser,
  generatePageMetadata,
  generatePageReadability,
  generatePageScreenshot,
  generatePageSnapshot,
  loadPageByUrl,
} from "../helper_functions/PuppeteerDataProviderHelperFunctions";
import { Capture, Schedule, Source, CapturePart } from "database";
import { CapturePartStatus } from "database/src/entities/CapturePart";
import { checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl } from "../helper_functions/CapturePartHelperFunctions";
import axios, { AxiosResponse } from "axios";

export type BlogArticleDataProviderLinkType = {
  url: string;
  text: string;
  innerText: string;
  alt: string | { [key: string]: any };
  title: string;
};

export type BlogArticleDataProviderLinkedPagePayloadIncludesType =
  | "readability"
  | "screenshot"
  | "snapshot"
  | "metadata";

export type BlogArticleDataProviderLinkedPagePayloadType = {
  index: number;
  includes: BlogArticleDataProviderLinkedPagePayloadIncludesType[];
} & BlogArticleDataProviderLinkType;

export type BlogArticleDataProviderPartIdentifierType = "linked-page";

export type CountMapOfCommonParentDirectoriesType = { [key: string]: number };

class BlogArticleDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return "blog-article";
  }

  getName(): string {
    return "Blog & News Articles";
  }

  getDescription(): string {
    return "Screenshots and snapshots this blog or news article and each of its related articles.";
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath:
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUxLjMgKDU3NTQ0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5BcnRib2FyZDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJBcnRib2FyZCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Imxpc3QtY29sdW1ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDEuMDAwMDAwKSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTAsMS45NzM0MjE5MyBMMCwxLjAzNjU0NDg1IEMwLDAuNDY4NDM4NTM4IDAuNDU5NDg5NDU2LDAuMDA5OTY2Nzc3NDEgMS4wMjg4NTY4MywwIEw3Ljk3MTE0MzE3LDAgQzguNTQwNTEwNTQsMCA5LDAuNDY4NDM4NTM4IDksMS4wMjY1NzgwNyBMOSwxLjk3MzQyMTkzIEM5LDIuNTQxNTI4MjQgOC41MzA1MjE2NCwzIDcuOTcxMTQzMTcsMyBMMS4wMjg4NTY4MywzIEMwLjQ1OTQ4OTQ1NiwzIDAsMi41NDE1MjgyNCAwLDEuOTczNDIxOTMgWiBNMCw2Ljk3MzQyMTkzIEwwLDYuMDM2NTQ0ODUgQzAsNS40Njg0Mzg1NCAwLjQ1OTQ4OTQ1Niw1LjAwOTk2Njc4IDEuMDI4ODU2ODMsNSBMNy45NzExNDMxNyw1IEM4LjU0MDUxMDU0LDUgOSw1LjQ2ODQzODU0IDksNi4wMjY1NzgwNyBMOSw2Ljk3MzQyMTkzIEM5LDcuNTQxNTI4MjQgOC41MzA1MjE2NCw4IDcuOTcxMTQzMTcsOCBMMS4wMjg4NTY4Myw4IEMwLjQ1OTQ4OTQ1Niw4IDAsNy41NDE1MjgyNCAwLDYuOTczNDIxOTMgWiBNMCwxMS45NzM0MjE5IEwwLDExLjAzNjU0NDkgQzAsMTAuNDY4NDM4NSAwLjQ1OTQ4OTQ1NiwxMC4wMDk5NjY4IDEuMDI4ODU2ODMsMTAgTDcuOTcxMTQzMTcsMTAgQzguNTQwNTEwNTQsMTAgOSwxMC40Njg0Mzg1IDksMTEuMDI2NTc4MSBMOSwxMS45NzM0MjE5IEM5LDEyLjU0MTUyODIgOC41MzA1MjE2NCwxMyA3Ljk3MTE0MzE3LDEzIEwxLjAyODg1NjgzLDEzIEMwLjQ1OTQ4OTQ1NiwxMyAwLDEyLjU0MTUyODIgMCwxMS45NzM0MjE5IFogTTAsMTYuOTczNDIxOSBMMCwxNi4wMzY1NDQ5IEMwLDE1LjQ2ODQzODUgMC40NTk0ODk0NTYsMTUuMDA5OTY2OCAxLjAyODg1NjgzLDE1IEw3Ljk3MTE0MzE3LDE1IEM4LjU0MDUxMDU0LDE1IDksMTUuNDY4NDM4NSA5LDE2LjAyNjU3ODEgTDksMTYuOTczNDIxOSBDOSwxNy41NDE1MjgyIDguNTMwNTIxNjQsMTggNy45NzExNDMxNywxOCBMMS4wMjg4NTY4MywxOCBDMC40NTk0ODk0NTYsMTggMCwxNy41NDE1MjgyIDAsMTYuOTczNDIxOSBaIE0xMSwxLjk3MzQyMTkzIEwxMSwxLjAzNjU0NDg1IEMxMSwwLjQ2ODQzODUzOCAxMS40NTk0ODk1LDAuMDA5OTY2Nzc3NDEgMTIuMDI4ODU2OCwwIEwxOC45NzExNDMyLDAgQzE5LjU0MDUxMDUsMCAyMCwwLjQ2ODQzODUzOCAyMCwxLjAyNjU3ODA3IEwyMCwxLjk3MzQyMTkzIEMyMCwyLjU0MTUyODI0IDE5LjUzMDUyMTYsMyAxOC45NzExNDMyLDMgTDEyLjAyODg1NjgsMyBDMTEuNDU5NDg5NSwzIDExLDIuNTQxNTI4MjQgMTEsMS45NzM0MjE5MyBaIE0xMSw2Ljk3MzQyMTkzIEwxMSw2LjAzNjU0NDg1IEMxMSw1LjQ2ODQzODU0IDExLjQ1OTQ4OTUsNS4wMDk5NjY3OCAxMi4wMjg4NTY4LDUgTDE4Ljk3MTE0MzIsNSBDMTkuNTQwNTEwNSw1IDIwLDUuNDY4NDM4NTQgMjAsNi4wMjY1NzgwNyBMMjAsNi45NzM0MjE5MyBDMjAsNy41NDE1MjgyNCAxOS41MzA1MjE2LDggMTguOTcxMTQzMiw4IEwxMi4wMjg4NTY4LDggQzExLjQ1OTQ4OTUsOCAxMSw3LjU0MTUyODI0IDExLDYuOTczNDIxOTMgWiBNMTEsMTEuOTczNDIxOSBMMTEsMTEuMDM2NTQ0OSBDMTEsMTAuNDY4NDM4NSAxMS40NTk0ODk1LDEwLjAwOTk2NjggMTIuMDI4ODU2OCwxMCBMMTguOTcxMTQzMiwxMCBDMTkuNTQwNTEwNSwxMCAyMCwxMC40Njg0Mzg1IDIwLDExLjAyNjU3ODEgTDIwLDExLjk3MzQyMTkgQzIwLDEyLjU0MTUyODIgMTkuNTMwNTIxNiwxMyAxOC45NzExNDMyLDEzIEwxMi4wMjg4NTY4LDEzIEMxMS40NTk0ODk1LDEzIDExLDEyLjU0MTUyODIgMTEsMTEuOTczNDIxOSBaIE0xMSwxNi45NzM0MjE5IEwxMSwxNi4wMzY1NDQ5IEMxMSwxNS40Njg0Mzg1IDExLjQ1OTQ4OTUsMTUuMDA5OTY2OCAxMi4wMjg4NTY4LDE1IEwxOC45NzExNDMyLDE1IEMxOS41NDA1MTA1LDE1IDIwLDE1LjQ2ODQzODUgMjAsMTYuMDI2NTc4MSBMMjAsMTYuOTczNDIxOSBDMjAsMTcuNTQxNTI4MiAxOS41MzA1MjE2LDE4IDE4Ljk3MTE0MzIsMTggTDEyLjAyODg1NjgsMTggQzExLjQ1OTQ4OTUsMTggMTEsMTcuNTQxNTI4MiAxMSwxNi45NzM0MjE5IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+",
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
    url: string
  ): Promise<SourceDomainInformationReturnType> {
    return super.getSourceDomainInformation(url);

    /**
     * TODO: @see https://www.notion.so/codeatlas/Build-UI-etc-for-podcast-DP-2b11d20d72ec4c91be3033217034f020?pvs=4#de488f21490d4c6cb2ba70d0aa6a7970
     */
    // let response: AxiosResponse | null = null;
    // try {
    //   response = await axios.get(url, { responseType: "document" });
    //   if (response === null) return super.getSourceDomainInformation(url);
    //   if (response.status !== 200) return super.getSourceDomainInformation(url);
    //   if ((response.headers["content-type"] !== "text/html") === false) return false;

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

    const firstPageSnapshot = await generatePageSnapshot(
      page,
      capture.downloadLocation
    );
    if (firstPageSnapshot === false) {
      const errorMessage = "The first page snapshot could not be generated";
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

    /**
     * We don't want to create a 'simplified' Mozilla Readability version of the URL if it is likely a homepage instead of an article
     * Stupidly, Wikipedia miss use the 'website' og:type for their articles, so we can include them regardless
     */
    let shouldCaptureReadability = true;
    if (
      firstPageMetadata?.ogType === "website" &&
      source.url.includes("wikipedia.org/") === false
    )
      shouldCaptureReadability = false;

    if (shouldCaptureReadability) {
      const firstPageReadability = await generatePageReadability(
        page,
        capture.downloadLocation
      );
      if (firstPageReadability === false) {
        const errorMessage =
          "The first page readability could not be generated";
        logger.error(errorMessage);

        await page.close();
        await browser.close();
        throw new Error(errorMessage);
      }
    }

    const allLinks = await this.determineAllLinks(page);
    const countMapOfCommonParentDirectories =
      await this.determineCountMapOfCommonParentDirectories(allLinks);
    const articleLinks = await this.filterLikelyArticleLinks(
      allLinks,
      countMapOfCommonParentDirectories
    );

    await this.generateIndexPageJsonFileOfLinks(
      articleLinks,
      capture.downloadLocation
    );

    await this.createCapturePartsForArticleLinks(
      schedule,
      capture,
      source,
      articleLinks
    );

    await page.close();
    await browser.close();

    return true;
  }

  async determineAllLinks(
    page: Page
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const linkHandles = await page.$$("a");

    const articleLinks: BlogArticleDataProviderLinkType[] = await Promise.all(
      linkHandles.map(async (link) => {
        return {
          url: (await (await link?.getProperty("href"))?.jsonValue()) ?? "",
          text: (await (await link?.getProperty("text"))?.jsonValue()) ?? "",
          innerText:
            (await (await link?.getProperty("innerText"))?.jsonValue()) ?? "",
          alt: (await (await link?.getProperty("alt"))?.jsonValue()) ?? "",
          title: (await (await link?.getProperty("title"))?.jsonValue()) ?? "",
        };
      })
    );

    return new Promise((resolve) => {
      resolve(
        articleLinks
          .map((link) => {
            if (link.url === "") return null;
            if (
              link.url.startsWith("http://") === false &&
              link.url.startsWith("https://") === false
            )
              return null;

            if (link.url.includes("#")) {
              const urlWithoutHash = link.url.split("#")[0];
              if (
                articleLinks.some(
                  (otherLink) => otherLink.url === urlWithoutHash
                )
              )
                return null;
              return {
                ...link,
                url: urlWithoutHash,
              } as BlogArticleDataProviderLinkType;
            }

            return link as BlogArticleDataProviderLinkType;
          })
          .filter((link) => link !== null) as BlogArticleDataProviderLinkType[]
      );
    });
  }

  async determineCountMapOfCommonParentDirectories(
    articleLinks: BlogArticleDataProviderLinkType[]
  ): Promise<CountMapOfCommonParentDirectoriesType> {
    const countMapOfCommonParentDirectories: CountMapOfCommonParentDirectoriesType =
      {};

    articleLinks.forEach((link) => {
      const safeUrl =
        link.url.startsWith("http://") || link.url.startsWith("https://")
          ? link.url
          : "https://" + link.url;
      const url = new URL(safeUrl);
      const pathParts = url.pathname.split("/");

      const commonParentDirectory = pathParts.slice(0, -1).join("/");

      if (commonParentDirectory === "") return;

      if (
        countMapOfCommonParentDirectories[commonParentDirectory] === undefined
      ) {
        countMapOfCommonParentDirectories[commonParentDirectory] = 0;
      }

      countMapOfCommonParentDirectories[commonParentDirectory] += 1;
    });

    return countMapOfCommonParentDirectories;
  }

  async filterSingleAndFewSiblingLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const singleAndFewSiblingLinks = allLinks.filter((link) => {
      const safeUrl =
        link.url.startsWith("http://") || link.url.startsWith("https://")
          ? link.url
          : "https://" + link.url;
      const url = new URL(safeUrl);
      const pathParts = url.pathname.split("/");

      const commonParentDirectory = pathParts.slice(0, -1).join("/");

      return countMap[commonParentDirectory] < 2;
    });

    return singleAndFewSiblingLinks;
  }

  async filterHighestSiblingLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const highestCounts = new Set(
      Object.values(countMap)
        .sort((a, b) => b - a)
        // .slice(0, 2)
        .slice(0, 1)
    );

    const highestSiblingLinks = allLinks.filter((link) => {
      const safeUrl =
        link.url.startsWith("http://") || link.url.startsWith("https://")
          ? link.url
          : "https://" + link.url;
      const url = new URL(safeUrl);
      const pathParts = url.pathname.split("/");

      const commonParentDirectory = pathParts.slice(0, -1).join("/");

      return highestCounts.has(countMap[commonParentDirectory]);
    });

    return highestSiblingLinks;
  }

  async filterLikelyArticleLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const countMapWithoutLikelyUnwantedKeys = Object.fromEntries(
      Object.entries(countMap)
        .map(([key, value]) =>
          this.testLikelyArticleLinkUrl(key) ? [key, value] : null
        )
        .filter((entry) => entry !== null) as Array<[string, number]>
    );

    const countMapCounts = Object.values(
      countMapWithoutLikelyUnwantedKeys
    ).sort((a, b) => b - a);
    const uniqueCountMapCounts = new Set(countMapCounts);
    const highHalfOfUniqueCountMapCounts = new Set(
      [...uniqueCountMapCounts].slice(
        0,
        Math.ceil(uniqueCountMapCounts.size / 2)
      )
    );

    const articleLinks = allLinks.filter((link) => {
      const safeUrl =
        link.url.startsWith("http://") || link.url.startsWith("https://")
          ? link.url
          : "https://" + link.url;
      const url = new URL(safeUrl);
      const pathParts = url.pathname.split("/");
      const commonParentDirectory = pathParts.slice(0, -1).join("/");
      return (
        highHalfOfUniqueCountMapCounts.has(countMap[commonParentDirectory]) &&
        this.testLikelyArticleLinkUrl(link.url)
      );
    });

    const uniqueArticleLinks = articleLinks.filter((link, index) => {
      return (
        articleLinks.findIndex((otherLink) => otherLink.url === link.url) ===
        index
      );
    });

    return uniqueArticleLinks;
  }

  testLikelyArticleLinkUrl(url: string): boolean {
    url = url.trim().toLowerCase();
    if (url === "") return false;

    // if url is 'comments' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/comments[^\dA-Za-z]|[^\dA-Za-z]comments/.test(url)) return false;

    // if url is 'comment' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/comment[^\dA-Za-z]|[^\dA-Za-z]comment/.test(url)) return false;

    // if url is 'authors' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/authors[^\dA-Za-z]|[^\dA-Za-z]authors/.test(url)) return false;

    // if url is 'author' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/author[^\dA-Za-z]|[^\dA-Za-z]author/.test(url)) return false;

    // if url is 'category' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/category[^\dA-Za-z]|[^\dA-Za-z]category/.test(url)) return false;

    // if url is 'tag' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/tag[^\dA-Za-z]|[^\dA-Za-z]tag/.test(url)) return false;

    return true;
  }

  async generateIndexPageJsonFileOfLinks(
    articleLinks: BlogArticleDataProviderLinkType[],
    captureDownloadDirectory: string
  ): Promise<void> {
    return fs.writeFile(
      path.join(captureDownloadDirectory, "links.json"),
      JSON.stringify(articleLinks),
      {},
      (error) => {
        /* */
      }
    );
  }

  async createCapturePartsForArticleLinks(
    schedule: Schedule,
    capture: Capture,
    source: Source,
    articleLinks: BlogArticleDataProviderLinkType[]
  ): Promise<void> {
    let shouldAddArticleLinks = true;
    if (
      source.useStartOrEndCursor === "start" &&
      source.currentStartCursorUrl != null
    )
      shouldAddArticleLinks = false;

    let countOfAddedCaptureParts = 0;

    const addCapturePart = async (
      link: BlogArticleDataProviderLinkType,
      index: number
    ): Promise<boolean> => {
      if (source.useStartOrEndCursor == null) {
        if (
          await checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl(
            schedule,
            link.url
          )
        )
          return true;
      }

      if (
        source.useStartOrEndCursor === "start" &&
        source?.currentStartCursorUrl === link.url
      ) {
        shouldAddArticleLinks = false;
        return false;
      }

      if (
        source.useStartOrEndCursor === "end" &&
        source?.currentEndCursorUrl === link.url
      ) {
        shouldAddArticleLinks = true;
        return true;
      }

      if (shouldAddArticleLinks) {
        const payload: BlogArticleDataProviderLinkedPagePayloadType = {
          index,
          includes: ["readability", "screenshot", "snapshot", "metadata"],
          ...link,
        };

        const downloadLocation = path.join(
          capture.downloadLocation,
          this.determineScreenshotFileNameFromLink(payload)
        );

        let capturePart: CapturePart | null = null;
        try {
          capturePart = await CapturePart.save({
            status: "pending" as CapturePartStatus,
            url: link.url,
            dataProviderPartIdentifier:
              "linked-page" as BlogArticleDataProviderPartIdentifierType,
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
            `Capture Part ${index} could not be created: ${link.url}`
          );
          return true;
        }

        countOfAddedCaptureParts += 1;
      }

      return true;
    };

    for (let index = 0; index < articleLinks.length; index++) {
      const articleLink = articleLinks[index];
      const shouldContinue = await addCapturePart(articleLink, index);
      if (shouldContinue === false) break;
    }

    if (source.useStartOrEndCursor === "start")
      source.currentStartCursorUrl = articleLinks[0].url;
    if (source.useStartOrEndCursor === "end")
      source.currentEndCursorUrl = articleLinks[articleLinks.length - 1].url;
    await source.save();

    logger.info(`Added ${countOfAddedCaptureParts} Capture Parts`);
  }

  /**
   * @throws {Error}
   */
  async processPart(capturePart: CapturePart): Promise<boolean | never> {
    switch (
      capturePart.dataProviderPartIdentifier as BlogArticleDataProviderPartIdentifierType
    ) {
      case "linked-page":
        return this.processLinkedPagePart(capturePart);
      default:
        return this.processDefaultPart(capturePart);
    }
  }

  /**
   * @throws {Error}
   */
  async processLinkedPagePart(
    capturePart: CapturePart
  ): Promise<boolean | never> {
    const payload: BlogArticleDataProviderLinkedPagePayloadType = JSON.parse(
      capturePart.payload
    );

    const browser = await createPuppeteerBrowser();

    const page = await loadPageByUrl(payload.url, browser);

    if (
      capturePart?.capture?.downloadLocation == null ||
      capturePart?.capture?.downloadLocation === "" ||
      capturePart?.downloadLocation == null ||
      capturePart?.downloadLocation === ""
    ) {
      const errorMessage = `No download location found for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);

      await page.close();
      await browser.close();

      throw new Error(errorMessage);
    }

    if (fs.existsSync(capturePart.downloadLocation) !== true) {
      fs.mkdirSync(capturePart.downloadLocation, { recursive: true });
    }

    if (fs.lstatSync(capturePart.downloadLocation).isDirectory() === false) {
      const errorMessage = `Download destination '${capturePart.downloadLocation}' is not a directory`;
      logger.error(errorMessage);

      await page.close();
      await browser.close();

      throw new Error(errorMessage);
    }

    const readabilityGenerationStatus = payload.includes.includes("readability")
      ? await generatePageReadability(page, capturePart.downloadLocation)
      : true;
    const screenshotGenerationStatus = payload.includes.includes("screenshot")
      ? await generatePageScreenshot(page, capturePart.downloadLocation)
      : true;
    const snapshotGenerationStatus = payload.includes.includes("snapshot")
      ? await generatePageSnapshot(page, capturePart.downloadLocation)
      : true;
    const metadataGenerationStatus = payload.includes.includes("metadata")
      ? await generatePageMetadata(page, capturePart.downloadLocation)
      : true;

    await page.close();
    await browser.close();

    if (readabilityGenerationStatus === false) {
      const errorMessage = `Readability could not be generated for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (screenshotGenerationStatus === false) {
      const errorMessage = `Screenshot could not be generated for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (snapshotGenerationStatus === false) {
      const errorMessage = `Snapshot could not be generated for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (metadataGenerationStatus === false) {
      const errorMessage = `Metadata could not be generated for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  }

  textIsSuitableForFileName(text: string | false): text is string {
    if (text === false) return false;
    if (text == null || text === "") return false;
    if (text.length > 50) return false;
    if (text.includes(">") || text.includes("<")) return false;
    return true;
  }

  determineScreenshotFileNameFromLink(
    link: BlogArticleDataProviderLinkType
  ): string {
    const sanitizedText = safeSanitizeFileName(link.text);
    if (this.textIsSuitableForFileName(sanitizedText)) return sanitizedText;

    const sanitizedInnerText = safeSanitizeFileName(link.innerText);
    if (this.textIsSuitableForFileName(sanitizedInnerText))
      return sanitizedInnerText;

    const sanitizedTitle = safeSanitizeFileName(link.title);
    if (this.textIsSuitableForFileName(sanitizedTitle)) return sanitizedTitle;

    const sanitizedAlt = safeSanitizeFileName(
      typeof link.alt === "string" ? link.alt : ""
    );
    if (this.textIsSuitableForFileName(sanitizedAlt)) return sanitizedAlt;

    const urlParts = link.url.split("/");
    const urlLastPart = urlParts[urlParts.length - 1];
    const sanitizedUrlLastPart = safeSanitizeFileName(urlLastPart);
    if (this.textIsSuitableForFileName(sanitizedUrlLastPart))
      return sanitizedUrlLastPart;

    return uuidV4();
  }

  /**
   * @throws {Error}
   */
  async processDefaultPart(capturePart: CapturePart): Promise<boolean | never> {
    const errorMessage = `A Data Provider Part '${capturePart.dataProviderPartIdentifier}' could not be found for Data Provider '${capturePart.capture?.schedule?.source?.dataProviderIdentifier}'`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export default BlogArticleDataProvider;
