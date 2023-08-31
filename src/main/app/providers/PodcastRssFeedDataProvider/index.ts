/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import {Capture, CapturePart, Schedule, Source} from '../../../database'
import Parser from 'rss-parser'
import path from 'node:path'
import fs from 'node:fs'
import {CapturePartStatus} from '../../../database/models/CapturePart'
// @ts-ignore
import standardSlugify from 'standard-slugify'
import {v4 as uuidV4, v4} from 'uuid'
import Downloader from 'nodejs-file-downloader'
import BaseDataProvider, {AllowedScheduleIntervalReturnType} from '../BaseDataProvider'
import logger from '../../../log'

type RssParserFeedType = {
  [key: string]: any;
} & Parser.Output<{
  [key: string]: any;
}>

type PodcastRssFeedDataProviderPartPayloadType = {
  index: number;
} & {
  [key: string]: any;
} & Parser.Item

type PodcastRssFeedDataProviderPartIdentifierType = 'audio-item' | 'video-item'

const audioFileExtensions = ['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac', '.wma', '.alac']
const videoFileExtensions = ['.mp4', '.m4v', '.mov', '.wmv', '.avi', '.avchd', '.flv', '.f4v', '.swf', '.mkv', '.webm', '.vob', '.ogv', '.drc', '.gif', '.gifv', '.mng', '.mts', '.m2ts', '.ts', '.mov', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', '.asf', '.amv', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mpg', '.mpeg', '.m2v', '.m4v', '.svi', '.3gp', '.3g2', '.mxf', '.roq', '.nsv', '.flv', '.f4v', '.f4p', '.f4a', '.f4b']

class PodcastRssFeedDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return 'podcast-rss-feed'
  }

  getName(): string {
    return 'Podcast RSS Feed'
  }

  getIconFilePath(): string {
    return 'microphone.svg'
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith('http://') || url.startsWith('https://')) === false) url = `https://${url}`

    try {
      const feed: RssParserFeedType | null = await this.determinePodcastContent(url)
      if (feed == null) return false
      if (!feed.items) return false
      if (feed.items.length === 0) return false

      const allItemsHaveLinksEndingInAudioFileExtension = feed.items.every(item => {
        if (!item.link) return false
        return (
          audioFileExtensions.find(extension => item.link?.endsWith(extension)) ||
          videoFileExtensions.find(extension => item.link?.endsWith(extension))
        )
      })
      if (!allItemsHaveLinksEndingInAudioFileExtension) return false

      const allItemsHaveEnclosures = feed.items.every(item => {
        if (!item.enclosure) return false
        if (!item.enclosure.url) return false
        return audioFileExtensions.find(extension => item.enclosure?.url?.endsWith(extension))
      })
      if (!allItemsHaveEnclosures) return false
    } catch (error) {
      return false
    }

    return true
  }

  async allowedScheduleInterval(): Promise<AllowedScheduleIntervalReturnType> {
    return {}
  }

  async determinePodcastContent(
    url: string,
  ): Promise<RssParserFeedType | null> {
    const request: Response | null = await fetch(url)
    if (request == null) return null
    if (request.status !== 200) return null

    const contents = await request.text()
    if (!contents) return null
    if (contents.includes('<rss') === false && contents.includes('<rss>') === false) return null

    const parser = new Parser()

    return parser.parseString(contents)
  }

  /**
   * @throws {Error}
   */
  async performCapture(
    capture: Capture,
    schedule: Schedule,
    source: Source,
  ): Promise<boolean | never> {
    const feed: RssParserFeedType | null = await this.determinePodcastContent(source.url)
    if (feed == null) return false

    if (await this.generatePodcastMetadataFile(capture, feed) === false) {
      const errorMessage = 'Failed to generate podcast metadata file'
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (await this.createCapturePartsForPodcastItems(capture, source, feed) === false) {
      const errorMessage = 'Failed to create Capture Parts for podcast items'
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    return true
  }

  async generatePodcastMetadataFile(
    capture: Capture,
    feed: RssParserFeedType,
  ): Promise<boolean> {
    const feedWithoutItems = {
      ...feed,
      items: undefined,
    }

    const feedMetadataFilePath = path.join(
      capture.downloadLocation,
      'metadata.json',
    )

    try {
      fs.writeFileSync(
        feedMetadataFilePath,
        JSON.stringify(feedWithoutItems, null, 2),
      )
    } catch (error) {
      return false
    }

    return true
  }

  async createCapturePartsForPodcastItems(
    capture: Capture,
    source: Source,
    feed: RssParserFeedType,
  ): Promise<boolean> {
    let shouldAddFeedItems = true
    if (source.useStartOrEndCursor === 'start' && source.currentStartCursorUrl != null) shouldAddFeedItems = false

    let countOfAddedCaptureParts = 0

    const addCapturePart = async (item: typeof feed.items[0], index: number): Promise<boolean> => {
      if (item.link == null) return true

      if (source.useStartOrEndCursor == null) {
        /**
         * If we are not using 'start' or 'end' cursor to determine when to start or to stop downloading capture parts,
         *   we should check the database to see if we have already downloaded this URL
         *
         * TODO: This will not work when we have multiple users and multiple types of data providers
         *  We will need to check that the capture of the found capture part belongs to the same source
         */

        const existingCapturePart = await CapturePart.findOne({
          where: {
            url: item.link,
            status: 'completed' as CapturePartStatus,
          },
        })

        if (existingCapturePart != null) return true
      }

      if (
        source.useStartOrEndCursor === 'start' &&
        item.link != null &&
        source?.currentStartCursorUrl === item.link
      ) {
        shouldAddFeedItems = false
        return false
      }

      if (
        source.useStartOrEndCursor === 'end' &&
        item.link != null &&
        source?.currentEndCursorUrl === item.link
      ) {
        shouldAddFeedItems = true
        return true
      }

      if (shouldAddFeedItems) {
        const dataProviderPartIdentifier: PodcastRssFeedDataProviderPartIdentifierType =
          audioFileExtensions.some(extension => item.link?.endsWith(extension)) ? 'audio-item' : 'video-item'

        const capturePart = await CapturePart.create({
          status: 'pending' as CapturePartStatus,
          url: item.link,
          dataProviderPartIdentifier,
          payload: JSON.stringify({index, ...item} as PodcastRssFeedDataProviderPartPayloadType),
          captureId: capture.id,
        })

        if (capturePart == null) {
          logger.error(`Capture Part ${index} could not be created: ${item.link}`)
          return true
        }

        countOfAddedCaptureParts += 1
      }

      return true
    }

    // Reminder: returning false will cancel loop, returning true will continue loop
    await feed.items.every((item, index) => addCapturePart(item, index))

    if (source.useStartOrEndCursor === 'start' && feed.items[0].link != null)
      source.currentStartCursorUrl = feed.items[0].link ?? null

    if (source.useStartOrEndCursor === 'end' && feed.items[feed.items.length - 1].link != null)
      source.currentEndCursorUrl = feed.items[feed.items.length - 1].link ?? null

    await source.save()

    logger.info(`Added ${countOfAddedCaptureParts} Capture Parts`)

    return true
  }

  /**
   * @throws {Error}
   */
  async processPart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    if (['audio-item', 'video-item'].includes(capturePart.dataProviderPartIdentifier as PodcastRssFeedDataProviderPartIdentifierType))
      return this.processMediaItemCapturePart(capturePart)

    return true
  }

  /**
   * @throws {Error}
   */
  async processMediaItemCapturePart(
    capturePart: CapturePart,
  ): Promise<boolean> {
    const payload: PodcastRssFeedDataProviderPartPayloadType = JSON.parse(capturePart.payload)
    if (payload.link == null) return false

    if (capturePart?.capture?.downloadLocation == null || capturePart?.capture?.downloadLocation === '') {
      const errorMessage = `No download location found for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    const capturePartDownloadDirectoryName = (payload.title != null && (payload.title ?? '').trim() !== '') ? standardSlugify(payload.title) : v4()
    const capturePartDownloadDestination = path.join(capturePart.capture.downloadLocation, capturePartDownloadDirectoryName)

    if (fs.existsSync(capturePartDownloadDestination) !== true) fs.mkdirSync(capturePartDownloadDestination, {recursive: true})

    if (fs.lstatSync(capturePartDownloadDestination).isDirectory() === false) {
      const errorMessage = `Download destination '${capturePartDownloadDestination}' is not a directory`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (await this.generatePodcastItemMetadataFile(capturePartDownloadDestination, payload) === false) {
      const errorMessage = `Failed to generate podcast item metadata file for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (await this.downloadPodcastItemMediaFile(capturePartDownloadDestination, payload) === false) {
      const errorMessage = `Failed to download podcast item media file for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    return true
  }

  async generatePodcastItemMetadataFile(
    capturePartDownloadDestination: string,
    capturePartPayload: PodcastRssFeedDataProviderPartPayloadType,
  ): Promise<boolean> {
    const itemMetadataFilePath = path.join(
      capturePartDownloadDestination,
      'metadata.json',
    )

    try {
      fs.writeFileSync(
        itemMetadataFilePath,
        JSON.stringify(capturePartPayload, null, 2),
      )
    } catch (error) {
      return false
    }

    return true
  }

  async downloadPodcastItemMediaFile(
    capturePartDownloadDestination: string,
    capturePartPayload: PodcastRssFeedDataProviderPartPayloadType,
  ): Promise<boolean> {
    const mediaDownloadUrl = capturePartPayload.enclosure?.url ?? capturePartPayload.link ?? ''
    if (mediaDownloadUrl == null || (mediaDownloadUrl ?? '').trim() === '') return false

    const downloader = new Downloader({
      url: mediaDownloadUrl,
      directory: capturePartDownloadDestination,
    })

    try {
      const {filePath, downloadStatus} = await downloader.download()
    } catch (error) {
      return false
    }

    return true
  }
}

export default PodcastRssFeedDataProvider
