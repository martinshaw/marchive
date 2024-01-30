/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
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
import Parser from "rss-parser";
import { v4 as uuidV4 } from "uuid";
import Downloader from "nodejs-file-downloader";
import { safeSanitizeFileName } from "utilities";
import { Capture, CapturePart, Schedule, Source } from "database";
import { CapturePartStatus } from "database/src/entities/CapturePart";
import { checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl } from "../helper_functions/CapturePartHelperFunctions";

export type RssParserFeedType = {
  [key: string]: any;
} & Parser.Output<{
  [key: string]: any;
}>;

export type PodcastRssFeedDataProviderPartPayloadType = {
  index: number;
} & {
  [key: string]: any;
} & Parser.Item;

type PodcastRssFeedDataProviderPartIdentifierType = "audio-item" | "video-item";

export const audioFileExtensions = [
  ".mp3",
  ".m4a",
  ".wav",
  ".ogg",
  ".aac",
  ".flac",
  ".wma",
  ".alac",
];
export const videoFileExtensions = [
  ".mp4",
  ".m4v",
  ".mov",
  ".wmv",
  ".avi",
  ".avchd",
  ".flv",
  ".f4v",
  ".swf",
  ".mkv",
  ".webm",
  ".vob",
  ".ogv",
  ".drc",
  ".gif",
  ".gifv",
  ".mng",
  ".mts",
  ".m2ts",
  ".ts",
  ".mov",
  ".qt",
  ".wmv",
  ".yuv",
  ".rm",
  ".rmvb",
  ".asf",
  ".amv",
  ".mpg",
  ".mp2",
  ".mpeg",
  ".mpe",
  ".mpv",
  ".mpg",
  ".mpeg",
  ".m2v",
  ".m4v",
  ".svi",
  ".3gp",
  ".3g2",
  ".mxf",
  ".roq",
  ".nsv",
  ".flv",
  ".f4v",
  ".f4p",
  ".f4a",
  ".f4b",
];

class PodcastRssFeedDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return "podcast-rss-feed";
  }

  getName(): string {
    return "Podcast RSS Feed";
  }

  getDescription(): string {
    return "Download each media file in this podcast feed and capture metadata";
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath: path.join(__dirname, "microphone.svg"),
      shouldInvertOnDarkMode: true,
    };
  }

  /**
   * @throws {Error}
   */
  getUrlForFeedItem(feedItem: Parser.Item | null | undefined): string | null {
    if (feedItem == null) return null;

    let url: string | null = null;

    if (feedItem.link != null && feedItem.link !== "")
      url = feedItem.link.trim();

    if (
      feedItem.enclosure != null &&
      feedItem.enclosure.url != null &&
      feedItem.enclosure.url !== ""
    )
      url = feedItem.enclosure.url.trim();

    if (url == null) {
      logger.error("Could not find a URL for podcast feed item", { feedItem });
      return null;
    }

    const urlExtension = url.split("?")[0].split(".").pop()?.trim() ?? null;
    if (urlExtension == null) {
      logger.warn("Podcast feed item URL has no extension", {
        feedItem,
        url,
        urlExtension,
      });
      return null;
    }

    if (audioFileExtensions.includes(`.${urlExtension}`)) return url;
    if (videoFileExtensions.includes(`.${urlExtension}`)) return url;

    logger.warn("Podcast feed item URL has an invalid extension", {
      feedItem,
      url,
      urlExtension,
    });
    return null;
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith("http://") || url.startsWith("https://")) === false)
      url = `https://${url}`;

    try {
      const feed: RssParserFeedType | null = await this.determinePodcastContent(
        url
      );
      if (feed == null) return false;
      if (feed.items === null) return false;
      if (feed.items.length === 0) return false;

      const allItemsHaveLinksEndingInAudioFileExtension = feed.items.every(
        (item) => this.getUrlForFeedItem(item) != null
      );

      if (allItemsHaveLinksEndingInAudioFileExtension === false) return false;
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
    let authorName = (await super.getSourceDomainInformation(url)).siteName;

    try {
      const feed: RssParserFeedType | null = await this.determinePodcastContent(
        url
      );
      if (feed == null) return super.getSourceDomainInformation(url);

      if (feed.itunes?.author != null) authorName = feed.itunes.author;
      if (feed.itunes?.owner?.name != null) authorName = feed.itunes.owner.name;
    } catch (error) {
      return super.getSourceDomainInformation(url);
    }

    return {
      siteName: authorName,
    };
  }

  async determinePodcastContent(
    url: string
  ): Promise<RssParserFeedType | null> {
    const request: Response | null = await fetch(url);
    if (request == null) return null;
    if (request.status !== 200) return null;

    const contents = await request.text();
    if (!contents) return null;
    if (
      contents.includes("<rss") === false &&
      contents.includes("<rss>") === false
    )
      return null;

    const parser = new Parser();
    return parser.parseString(contents);
  }

  /**
   * @throws {Error}
   */
  async performCapture(
    capture: Capture,
    schedule: Schedule,
    source: Source
  ): Promise<boolean | never> {
    const feed: RssParserFeedType | null = await this.determinePodcastContent(
      source.url
    );

    if (feed == null) return false;

    if (feed.title != null && feed.title !== "") {
      source.name = feed.title.toString();
      await source.save();
    }

    if ((await this.generatePodcastMetadataFile(capture, feed)) === false) {
      const errorMessage = "Failed to generate podcast metadata file";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if ((await this.generatePodcastLogoImageFile(capture, feed)) === false) {
      const warningMessage =
        "Podcast feed does not have a logo image file to be downloaded";
      logger.warn(warningMessage, { feed, captureId: capture.id });
    }

    if ((await this.generatePodcastItunesImageFile(capture, feed)) === false) {
      const warningMessage =
        "Podcast feed does not have a iTunes image file to be downloaded";
      logger.warn(warningMessage, { feed, captureId: capture.id });
    }

    if (
      (await this.createCapturePartsForPodcastItems(
        schedule,
        capture,
        source,
        feed
      )) === false
    ) {
      const errorMessage = "Failed to create Capture Parts for podcast items";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  }

  async generatePodcastMetadataFile(
    capture: Capture,
    feed: RssParserFeedType
  ): Promise<boolean> {
    const feedWithoutItems = {
      ...feed,
      items: undefined,
    };

    const feedMetadataFilePath = path.join(
      capture.downloadLocation,
      "metadata.json"
    );

    try {
      fs.writeFileSync(
        feedMetadataFilePath,
        JSON.stringify(feedWithoutItems, null, 2)
      );
    } catch (error) {
      return false;
    }

    return true;
  }

  async generatePodcastLogoImageFile(
    capture: Capture,
    feed: RssParserFeedType
  ): Promise<boolean> {
    if (feed.image == null) return false;

    const podcastLogoImageUrl = feed.image.url ?? null;
    if (podcastLogoImageUrl == null) return false;

    const logoImageDownloader = new Downloader({
      url: podcastLogoImageUrl,
      directory: capture.downloadLocation,
      fileName: "logo-image.jpg",
    });

    try {
      await logoImageDownloader.download();
    } catch (error) {
      logger.error("Unable to download podcast feed logo image due to error", {
        feed,
        captureId: capture.id,
      });
      logger.error(error);
      return false;
    }

    return true;
  }

  async generatePodcastItunesImageFile(
    capture: Capture,
    feed: RssParserFeedType
  ): Promise<boolean> {
    if (feed.itunes == null) return false;
    if (feed.itunes.image == null) return false;

    const podcastItunesImageUrl = feed.itunes.image ?? null;
    if (podcastItunesImageUrl == null) return false;

    const itunesImageDownloader = new Downloader({
      url: podcastItunesImageUrl,
      directory: capture.downloadLocation,
      fileName: "itunes-image.jpg",
    });

    try {
      await itunesImageDownloader.download();
    } catch (error) {
      logger.error(
        "Unable to download podcast feed iTunes image due to error",
        { feed, captureId: capture.id }
      );
      logger.error(error);
      return false;
    }

    return true;
  }

  async createCapturePartsForPodcastItems(
    schedule: Schedule,
    capture: Capture,
    source: Source,
    feed: RssParserFeedType
  ): Promise<boolean> {
    let shouldAddFeedItems = true;
    if (
      source.useStartOrEndCursor === "start" &&
      source.currentStartCursorUrl != null
    )
      shouldAddFeedItems = false;

    let countOfAddedCaptureParts = 0;

    const addCapturePart = async (
      item: (typeof feed.items)[0],
      index: number
    ): Promise<boolean> => {
      const feedItemFileUrl = this.getUrlForFeedItem(item);
      if (feedItemFileUrl == null) return true;

      if (source.useStartOrEndCursor == null) {
        if (
          await checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl(
            schedule,
            feedItemFileUrl
          )
        )
          return true;
      }

      if (
        source.useStartOrEndCursor === "start" &&
        source?.currentStartCursorUrl === feedItemFileUrl
      ) {
        shouldAddFeedItems = false;
        return false;
      }

      if (
        source.useStartOrEndCursor === "end" &&
        source?.currentEndCursorUrl === feedItemFileUrl
      ) {
        shouldAddFeedItems = true;
        return true;
      }

      if (shouldAddFeedItems) {
        const urlExtension =
          feedItemFileUrl.split("?")[0].split(".").pop()?.trim() ?? null;

        let dataProviderPartIdentifier: PodcastRssFeedDataProviderPartIdentifierType | null =
          null;
        if (audioFileExtensions.includes("." + urlExtension))
          dataProviderPartIdentifier = "audio-item";
        if (videoFileExtensions.includes("." + urlExtension))
          dataProviderPartIdentifier = "video-item";

        if (dataProviderPartIdentifier == null) return true;

        const payload: PodcastRssFeedDataProviderPartPayloadType = {
          index,
          ...item,
        };

        let capturePartDownloadDirectoryName = safeSanitizeFileName(
          payload.title ?? ""
        );
        if (
          capturePartDownloadDirectoryName === "" ||
          capturePartDownloadDirectoryName == null ||
          capturePartDownloadDirectoryName === false
        ) {
          capturePartDownloadDirectoryName = uuidV4();
        }
        const downloadLocation = path.join(
          capture.downloadLocation,
          capturePartDownloadDirectoryName
        );

        let capturePart: CapturePart | null = null;
        try {
          capturePart = await CapturePart.create({
            status: "pending" as CapturePartStatus,
            url: feedItemFileUrl,
            dataProviderPartIdentifier,
            payload: JSON.stringify(payload),
            downloadLocation,
            capture,
          });
        } catch (error) {
          logger.error(
            "A DB error occurred when trying to create a new Capture Part"
          );
          logger.error(error);
        }

        if (capturePart == null) {
          logger.error(
            `Capture Part ${index} could not be created: ${feedItemFileUrl}`,
            { payload }
          );
          return true;
        }

        logger.info("Created Capture Part", {
          capturePartId: capturePart.id,
          capturePartDownloadLocation: capturePart.downloadLocation,
          capturePartUrl: capturePart.url,
        });

        countOfAddedCaptureParts += 1;
      }

      return true;
    };

    for (let index = 0; index < feed.items.length; index++) {
      const item = feed.items[index];
      const shouldContinue = await addCapturePart(item, index);
      if (shouldContinue === false) break;
    }

    const startUrl = this.getUrlForFeedItem(feed.items[0]);
    if (source.useStartOrEndCursor === "start" && startUrl != null) {
      source.currentStartCursorUrl = startUrl ?? null;
    }

    const endUrl = this.getUrlForFeedItem(feed.items[feed.items.length - 1]);
    if (source.useStartOrEndCursor === "end" && endUrl != null) {
      source.currentEndCursorUrl = endUrl ?? null;
    }

    await source.save();

    logger.info(`Added ${countOfAddedCaptureParts} Capture Parts`);

    return true;
  }

  /**
   * @throws {Error}
   */
  async processPart(capturePart: CapturePart): Promise<boolean | never> {
    if (
      ["audio-item", "video-item"].includes(
        capturePart.dataProviderPartIdentifier as PodcastRssFeedDataProviderPartIdentifierType
      )
    )
      return this.processMediaItemCapturePart(capturePart);

    return true;
  }

  /**
   * @throws {Error}
   */
  async processMediaItemCapturePart(
    capturePart: CapturePart
  ): Promise<boolean> {
    const payload: PodcastRssFeedDataProviderPartPayloadType = JSON.parse(
      capturePart.payload
    );
    const feedItemFileUrl = this.getUrlForFeedItem(payload);
    if (feedItemFileUrl == null) return false;

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

    if (
      (await this.generatePodcastItemMetadataFile(capturePart, payload)) ===
      false
    ) {
      const errorMessage = `Failed to generate podcast item metadata file for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (
      (await this.downloadPodcastItemMediaFile(
        capturePart,
        payload,
        feedItemFileUrl
      )) === false
    ) {
      const errorMessage = `Failed to download podcast item media file for Capture Part ${capturePart.id}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  }

  async generatePodcastItemMetadataFile(
    capturePart: CapturePart,
    capturePartPayload: PodcastRssFeedDataProviderPartPayloadType
  ): Promise<boolean> {
    const itemMetadataFilePath = path.join(
      capturePart.downloadLocation,
      "metadata.json"
    );

    try {
      fs.writeFileSync(
        itemMetadataFilePath,
        JSON.stringify(capturePartPayload, null, 2)
      );
    } catch (error) {
      return false;
    }

    return true;
  }

  async downloadPodcastItemMediaFile(
    capturePart: CapturePart,
    capturePartPayload: PodcastRssFeedDataProviderPartPayloadType,
    mediaDownloadUrl: string
  ): Promise<boolean> {
    const downloader = new Downloader({
      url: mediaDownloadUrl,
      directory: capturePart.downloadLocation,
    });

    try {
      const { filePath, downloadStatus } = await downloader.download();
    } catch (error) {
      return false;
    }

    return true;
  }
}

export default PodcastRssFeedDataProvider;
