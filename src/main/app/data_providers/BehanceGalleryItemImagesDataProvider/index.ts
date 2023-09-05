/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-27T18:29:22.150Z
Modified: 2023-08-27T18:29:22.150Z

Description: description
*/

import {Browser, Page} from 'puppeteer'
import {Capture, CapturePart, Schedule, Source} from '../../../database'
import path from 'node:path'
import fs from 'node:fs'
import {createPuppeteerBrowser, retrievePageHeadMetadata, scrollPageToTop, smoothlyScrollPageToBottom} from '../helper_functions/PuppeteerDataProviderHelperFunctions'
import BaseDataProvider, {AllowedScheduleIntervalReturnType, BaseDataProviderIconInformationReturnType} from '../BaseDataProvider'
import {CapturePartStatus} from '../../../database/models/CapturePart'
import {v4 as uuidV4} from 'uuid'
import Downloader from 'nodejs-file-downloader'
import {JSONObject, JSONValue} from 'types-json'
import logger from '../../../log'

type BehanceGalleryItemImagesDataProviderImageType = {
  url: string;
  caption: string | null;
}

type BehanceGalleryItemImagesDataProviderImagePayloadType = {
  index: number;
} & BehanceGalleryItemImagesDataProviderImageType

type BehanceGalleryItemImagesDataProviderPartIdentifierType = 'image'

class BehanceGalleryItemImagesDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return 'behance-gallery-item-images'
  }

  getName(): string {
    return 'Images from a Behance gallery project page'
  }

  getDescription(): string {
    return 'Captures all images, tags, comments and metadata from a Behance gallery project page'
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath: path.join(__dirname, 'icon.png'),
      shouldInvertOnDarkMode: false,
    }
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith('http://') || url.startsWith('https://')) === false) url = `https://${url}`

    if (url.startsWith('https://www.behance.net/gallery/') === false && url.startsWith('https://www.behance.net/gallery/') === false) return false

    let request: Response | null = null
    try {
      request = await fetch(url)
      if (request === null) return false
      if (request.status !== 200) return false

      const contents = await request.text()
      if (!contents) return false
      if (contents.includes('<body ') === false && contents.includes('<body>') === false) return false
    } catch (error) {
      return false
    }

    return true
  }

  async allowedScheduleInterval(): Promise<AllowedScheduleIntervalReturnType> {
    // There is no need to re-capture this page and page's image data, because it is unlikely to ever change / to be added to
    return {
      onlyRunOnce: true,
    }
  }

  /**
   * @throws {Error}
   */
  async performCapture(
    capture: Capture,
    schedule: Schedule,
    source: Source,
  ): Promise<boolean | never> {
    const browser = await createPuppeteerBrowser()

    const page = await browser.newPage()
    await page.setViewport({width: 1280, height: 800})

    await page.goto(
      source.url,
      {
        timeout: 0,
        waitUntil: 'networkidle2',
      },
    )

    await scrollPageToTop(page)
    await smoothlyScrollPageToBottom(page, {})
    await scrollPageToTop(page)

    const indexPageDownloadFileName = path.join(
      capture.downloadLocation,
      'screenshot.jpg',
    )

    await page.screenshot({
      fullPage: true,
      path: indexPageDownloadFileName,
      quality: 85,
    })

    await this.generatePageHeadMetadata(page, capture.downloadLocation)

    await this.generatePageProjectMetadata(page, capture.downloadLocation)

    const pageImages = await this.determineAllImages(page)

    try {
      await this.createCapturePartsForImages(
        capture,
        source,
        pageImages,
      )
    } catch (error) {
      await page.close()
      await browser.close()

      throw error
    }

    await page.close()
    await browser.close()

    return true
  }

  async generatePageHeadMetadata(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    const headMetadataFileName = path.join(captureDownloadDirectory, 'metadata.json')

    const headMetadata = await retrievePageHeadMetadata(page)
    fs.writeFileSync(headMetadataFileName, JSON.stringify(headMetadata))

    return fs.existsSync(headMetadataFileName)
  }

  async generatePageProjectMetadata(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    const projectMetadataFileName = path.join(captureDownloadDirectory, 'project.json')

    const projectMetadata: JSONObject = {}

    const textContentSelectors = [
      {selector: '[class*="Project-main-"] [class*="Project-title-"]', key: 'title'},
    ]

    textContentSelectors.forEach(async ({selector, key}) => {
      await page.waitForSelector(selector)
      const element = await page.$(selector)
      const value = await page.evaluate(el => el?.textContent, element)
      projectMetadata[key] = value ?? null
    })

    const authorItemsSelector = '[class*="ProjectInfo-sideBar"] [class*="ProjectInfo-profileInfo"]:first-child [class*="UserInfo-individualProfile-"]'
    await page.waitForSelector(authorItemsSelector)
    const authorHandles = await page.$$(authorItemsSelector)
    const authorsData: {
      avatarImageUrl: string | null;
      name: string | null;
      url: string | null;
      locationName: string | null;
      locationUrl: string | null;
    }[] = await Promise.all(
      authorHandles.map(async authorHandle =>
        page.evaluate(el => {
          return {
            avatarImageUrl: el?.querySelector('[class*="UserInfo-userAvatar-"] img')?.getAttribute('src') ?? null,
            name: el?.querySelector('a[class*="UserInfo-userName"]')?.textContent ?? null,
            url: el?.querySelector('a[class*="UserInfo-userName"]')?.getAttribute('href') ?? null,
            locationName: el?.querySelector('a[class*="UserInfo-userLocation"]')?.textContent ?? null,
            locationUrl: el?.querySelector('a[class*="UserInfo-userLocation"]')?.getAttribute('href') ?? null,

          }
        }, authorHandle),
      ),
    )
    projectMetadata.authors = authorsData

    const commentItemsSelector = '[class*="ProjectComments-projectComment-"] ul li'
    await page.waitForSelector(commentItemsSelector)
    const commentHandles = await page.$$(commentItemsSelector)
    const commentsData: {
      avatarImageUrl: string | null;
      authorName: string | null;
      authorUrl: string | null;
      content: string | null;
    }[] = await Promise.all(
      commentHandles.map(async commentHandle =>
        page.evaluate(el => {
          return {
            avatarImageUrl: el?.querySelector('[class*="ProjectComment-avatar-"] img')?.getAttribute('src') ?? null,
            authorName: el?.querySelector('a[class*="ProjectComment-userName-"]')?.textContent ?? null,
            authorUrl: el?.querySelector('a[class*="ProjectComment-userName-"]')?.getAttribute('href') ?? null,
            content: el?.querySelector('[class*="ProjectComment-comment-"]')?.textContent ?? null,
          }
        }, commentHandle),
      ),
    )
    projectMetadata.comments = commentsData

    const tagItemsSelector = 'ul[class*="ProjectTags-projectTags-"] li'
    await page.waitForSelector(tagItemsSelector)
    const tagHandles = await page.$$(tagItemsSelector)
    const tagsData: {
      url: string | null;
      caption: string | null;
    }[] = await Promise.all(
      tagHandles.map(async tagHandle =>
        page.evaluate(el => {
          return {
            url: el?.querySelector('a')?.getAttribute('href') ?? null,
            caption: el?.querySelector('a')?.textContent ?? null,
          }
        }, tagHandle),
      ),
    )
    projectMetadata.tags = tagsData

    fs.writeFileSync(projectMetadataFileName, JSON.stringify(projectMetadata))

    return fs.existsSync(projectMetadataFileName)
  }

  async determineAllImages(
    page: Page,
  ): Promise<BehanceGalleryItemImagesDataProviderImageType[]> {
    const imageHandles = await page.$$('#primary-project-content img')

    const images: BehanceGalleryItemImagesDataProviderImageType[] = await Promise.all(
      imageHandles.map(async image => {
        return {
          url: (await ((await image?.getProperty('src'))?.jsonValue())) ?? '',
          caption: (await ((await image?.getProperty('alt'))?.jsonValue())) ?? null,
        }
      }),
    )

    return new Promise(resolve => {
      resolve(
        images.map(image => {
          if (image.url === '') return null
          if (image.url.startsWith('http://') === false && image.url.startsWith('https://') === false) return null

          if (image.url.includes('#')) {
            const urlWithoutHash = image.url.split('#')[0]
            if (images.some(otherImage => otherImage.url === urlWithoutHash)) return null
            return {...image, url: urlWithoutHash} as BehanceGalleryItemImagesDataProviderImageType
          }

          return image as BehanceGalleryItemImagesDataProviderImageType
        })
        .filter(image => image !== null) as BehanceGalleryItemImagesDataProviderImageType[],
      )
    })
  }

  /**
   * @throws {Error}
   */
  async createCapturePartsForImages(
    capture: Capture,
    source: Source,
    images: BehanceGalleryItemImagesDataProviderImageType[],
  ): Promise<void | never> {
    let shouldAddImage = true
    if (source.useStartOrEndCursor === 'start' && source.currentStartCursorUrl != null) shouldAddImage = false

    let countOfAddedCaptureParts = 0

    const addCapturePart = async (image: BehanceGalleryItemImagesDataProviderImageType, index: number): Promise<boolean> => {
      if (source.useStartOrEndCursor == null) {
        /**
         * If we are not using 'start' or 'end' cursor to determine when to start or to stop downloading capture parts,
         *   we should check the database to see if we have already downloaded this URL
         *
         * TODO: This will not work when we have multiple users and multiple types of data providers
         *  We will need to check that the capture of the found capture part belongs to the same source
         *
         * TODO: might need to add sourceId to the capturePart table then add it as where equal criteria to this query
         */

        const existingCapturePart = await CapturePart.findOne({
          where: {
            url: image.url,
            status: 'completed' as CapturePartStatus,
          },
        })

        if (existingCapturePart != null) {
          logger.info(`Capture Part ${index} has been previously downloaded: ${image.url}`)
          return true
        }
      }

      if (
        source.useStartOrEndCursor === 'start' &&
        source?.currentStartCursorUrl === image.url
      ) {
        shouldAddImage = false
        return false
      }

      if (
        source.useStartOrEndCursor === 'end' &&
        source?.currentEndCursorUrl === image.url
      ) {
        shouldAddImage = true
        return true
      }

      if (shouldAddImage) {
        const capturePart = await CapturePart.create({
          status: 'pending' as CapturePartStatus,
          url: image.url,
          dataProviderPartIdentifier: 'image' as BehanceGalleryItemImagesDataProviderPartIdentifierType,
          payload: JSON.stringify({index, ...image} as BehanceGalleryItemImagesDataProviderImagePayloadType),
          captureId: capture.id,
        })

        if (capturePart === null) {
          logger.error(`Capture Part ${index} could not be created: ${image.url}`)
          return true
        }

        countOfAddedCaptureParts += 1
      }

      return true
    }

    // Reminder: returning false will cancel loop, returning true will continue loop
    images.every(async (image, index) => await addCapturePart(image, index))

    if (source.useStartOrEndCursor === 'start') source.currentStartCursorUrl = images[0].url
    if (source.useStartOrEndCursor === 'end') source.currentEndCursorUrl = images[images.length - 1].url
    await source.save()

    logger.info(`Added ${countOfAddedCaptureParts} Capture Parts`)
  }

  /**
   * @throws {Error}
   */
  async processPart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    switch (capturePart.dataProviderPartIdentifier) {
    case 'image': return this.processImageCapturePart(capturePart)
    default: return false
    }
  }

  /**
   * @throws {Error}
   */
  async processImageCapturePart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    const payload: BehanceGalleryItemImagesDataProviderImagePayloadType = JSON.parse(capturePart.payload)
    if (payload.url == null || payload.url === '') return false

    if (capturePart?.capture?.downloadLocation == null || capturePart?.capture?.downloadLocation === '') {
      const errorMessage = `No download location found for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    const capturePartDownloadDirectoryName = uuidV4()
    const capturePartDownloadDestination = path.join(capturePart.capture.downloadLocation, capturePartDownloadDirectoryName)

    if (fs.existsSync(capturePartDownloadDestination) !== true) fs.mkdirSync(capturePartDownloadDestination, {recursive: true})

    if (fs.lstatSync(capturePartDownloadDestination).isDirectory() === false) {
      const errorMessage = `Download destination '${capturePartDownloadDestination}' is not a directory`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (await this.downloadImageMediaFile(capturePartDownloadDestination, payload) === false) {
      const errorMessage = `Failed to download podcast item media file for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    return true
  }

  /**
   * @throws {Error}
   */
  async downloadImageMediaFile(
    capturePartDownloadDestination: string,
    payload: BehanceGalleryItemImagesDataProviderImagePayloadType,
  ): Promise<boolean | never> {
    if (payload.url == null || (payload.url ?? '').trim() === '') return false

    const downloader = new Downloader({
      url: payload.url,
      directory: capturePartDownloadDestination,
    })

    try {
      const {filePath, downloadStatus} = await downloader.download()
    } catch (error) {
      const errorMessage = `Failed to download image media file for Capture Part ${payload.index} from ${payload.url}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    return true
  }
}

export default BehanceGalleryItemImagesDataProvider