/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BlogArticleDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import fs from 'node:fs'
import path from 'node:path'
import logger from '../../log'
import {v4 as uuidV4} from 'uuid'
import {Browser, Page} from 'puppeteer-core'
import { safeSanitizeFileName } from '../../../util'
import {CapturePartStatus} from '../../../database/models/CapturePart'
import {Capture, Schedule, Source, CapturePart} from '../../../database'
import BaseDataProvider, {AllowedScheduleIntervalReturnType, BaseDataProviderIconInformationReturnType} from '../BaseDataProvider'
import { checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl } from '../helper_functions/CapturePartHelperFunctions'
import {createPuppeteerBrowser, loadPageByUrl, retrievePageHeadMetadata, scrollPageToTop, smoothlyScrollPageToBottom} from '../helper_functions/PuppeteerDataProviderHelperFunctions'

export type BlogArticleDataProviderLinkType = {
  url: string;
  text: string;
  innerText: string;
  alt: string | {[key: string]: any};
  title: string;
}

export type BlogArticleDataProviderLinkedPagePayloadIncludesType = 'screenshot' | 'snapshot' | 'metadata'

export type BlogArticleDataProviderLinkedPagePayloadType = {
  index: number;
  includes: BlogArticleDataProviderLinkedPagePayloadIncludesType[]
} & BlogArticleDataProviderLinkType

export type BlogArticleDataProviderPartIdentifierType = 'linked-page'

export type CountMapOfCommonParentDirectoriesType = {[key: string]: number};

class BlogArticleDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return 'blog-article'
  }

  getName(): string {
    return 'Blog & News Articles'
  }

  getDescription(): string {
    return 'Screenshots and snapshots this blog or news article and each of its related articles.'
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath: path.join(__dirname, 'list-columns.svg'),
      shouldInvertOnDarkMode: true,
    }
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith('http://') || url.startsWith('https://')) === false) url = `https://${url}`

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
    return {}
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

    const page = await this.loadSourceIndexPage(
      source,
      browser,
    )

    const firstPageScreenshot = await this.generatePageScreenshot(page, capture.downloadLocation)
    if (firstPageScreenshot === false) {
      const errorMessage = 'The first page screenshot could not be generated'
      logger.error(errorMessage)

      await page.close()
      await browser.close()
      throw new Error(errorMessage)
    }

    const firstPageSnapshot = await this.generatePageSnapshot(page, capture.downloadLocation)
    if (firstPageSnapshot === false) {
      const errorMessage = 'The first page snapshot could not be generated'
      logger.error(errorMessage)

      await page.close()
      await browser.close()
      throw new Error(errorMessage)
    }

    const firstPageMetadata = await this.generatePageMetadata(page, capture.downloadLocation)
    if (firstPageMetadata === false) {
      const errorMessage = 'The first page metadata could not be generated'
      logger.error(errorMessage)

      await page.close()
      await browser.close()
      throw new Error(errorMessage)
    }

    const allLinks = await this.determineAllLinks(page)
    const countMapOfCommonParentDirectories = await this.determineCountMapOfCommonParentDirectories(allLinks)
    const articleLinks = await this.filterLikelyArticleLinks(allLinks, countMapOfCommonParentDirectories)

    await this.generateIndexPageJsonFileOfLinks(articleLinks, capture.downloadLocation)

    await this.createCapturePartsForArticleLinks(
      schedule,
      capture,
      source,
      articleLinks,
    )

    await page.close()

    await browser.close()

    return true
  }

  async loadSourceIndexPage(source: Source, browser: Browser): Promise<Page> {
    return loadPageByUrl(source.url, browser)
  }

  async generatePageScreenshot(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    await scrollPageToTop(page)
    await smoothlyScrollPageToBottom(page, {})
    await scrollPageToTop(page)

    const screenshotFileName = path.join(captureDownloadDirectory, 'index.jpg')

    await page.screenshot({
      fullPage: true,
      path: screenshotFileName,
      quality: 85,
    })

    return fs.existsSync(screenshotFileName)
  }

  async generatePageSnapshot(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    const snapshotFileName = path.join(captureDownloadDirectory, 'snapshot.mhtml')

    const cdp = await page.target().createCDPSession()
    const {data} = await cdp.send('Page.captureSnapshot', {format: 'mhtml'})
    fs.writeFileSync(snapshotFileName, data)

    return fs.existsSync(snapshotFileName)
  }

  async generatePageMetadata(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    const metadataFileName = path.join(captureDownloadDirectory, 'metadata.json')

    const metadata = await retrievePageHeadMetadata(page)
    fs.writeFileSync(metadataFileName, JSON.stringify(metadata))

    return fs.existsSync(metadataFileName)
  }

  async determineAllLinks(
    page: Page,
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const linkHandles = await page.$$('a')

    const articleLinks: BlogArticleDataProviderLinkType[] = await Promise.all(
      linkHandles.map(async link => {
        return {
          url: (await ((await link?.getProperty('href'))?.jsonValue())) ?? '',
          text: (await ((await link?.getProperty('text'))?.jsonValue())) ?? '',
          innerText: (await ((await link?.getProperty('innerText'))?.jsonValue())) ?? '',
          alt: (await ((await link?.getProperty('alt'))?.jsonValue())) ?? '',
          title: (await ((await link?.getProperty('title'))?.jsonValue())) ?? '',
        }
      }),
    )

    return new Promise(resolve => {
      resolve(
        articleLinks.map(link => {
          if (link.url === '') return null
          if (link.url.startsWith('http://') === false && link.url.startsWith('https://') === false) return null

          if (link.url.includes('#')) {
            const urlWithoutHash = link.url.split('#')[0]
            if (articleLinks.some(otherLink => otherLink.url === urlWithoutHash)) return null
            return {...link, url: urlWithoutHash} as BlogArticleDataProviderLinkType
          }

          return link as BlogArticleDataProviderLinkType
        })
        .filter(link => link !== null) as BlogArticleDataProviderLinkType[],
      )
    })
  }

  async determineCountMapOfCommonParentDirectories(
    articleLinks: BlogArticleDataProviderLinkType[],
  ): Promise<CountMapOfCommonParentDirectoriesType> {
    const countMapOfCommonParentDirectories: CountMapOfCommonParentDirectoriesType = {}

    articleLinks.forEach(link => {
      const safeUrl = link.url.startsWith('http://') || link.url.startsWith('https://') ? link.url : 'https://' + link.url
      const url = new URL(safeUrl)
      const pathParts = url.pathname.split('/')

      const commonParentDirectory = pathParts.slice(0, -1).join('/')

      if (commonParentDirectory === '') return

      if (countMapOfCommonParentDirectories[commonParentDirectory] === undefined) {
        countMapOfCommonParentDirectories[commonParentDirectory] = 0
      }

      countMapOfCommonParentDirectories[commonParentDirectory] += 1
    })

    return countMapOfCommonParentDirectories
  }

  async filterSingleAndFewSiblingLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType,
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const singleAndFewSiblingLinks = allLinks.filter(link => {
      const safeUrl = link.url.startsWith('http://') || link.url.startsWith('https://') ? link.url : 'https://' + link.url
      const url = new URL(safeUrl)
      const pathParts = url.pathname.split('/')

      const commonParentDirectory = pathParts.slice(0, -1).join('/')

      return countMap[commonParentDirectory] < 2
    })

    return singleAndFewSiblingLinks
  }

  async filterHighestSiblingLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType,
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const highestCounts = new Set(
      Object
      .values(countMap)
      .sort((a, b) => b - a)
      // .slice(0, 2)
      .slice(0, 1),
    )

    const highestSiblingLinks = allLinks.filter(link => {
      const safeUrl = link.url.startsWith('http://') || link.url.startsWith('https://') ? link.url : 'https://' + link.url
      const url = new URL(safeUrl)
      const pathParts = url.pathname.split('/')

      const commonParentDirectory = pathParts.slice(0, -1).join('/')

      return highestCounts.has(countMap[commonParentDirectory])
    })

    return highestSiblingLinks
  }

  async filterLikelyArticleLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType,
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const countMapWithoutLikelyUnwantedKeys = Object.fromEntries(
      Object
      .entries(countMap)
      .map(([key, value]) => this.testLikelyArticleLinkUrl(key) ? [key, value] : null)
      .filter(entry => entry !== null) as Array<[string, number]>,
    )

    const countMapCounts = Object.values(countMapWithoutLikelyUnwantedKeys).sort((a, b) => b - a)
    const uniqueCountMapCounts = new Set(countMapCounts)
    const highHalfOfUniqueCountMapCounts = new Set([...uniqueCountMapCounts].slice(0, Math.ceil(uniqueCountMapCounts.size / 2)))

    const articleLinks = allLinks.filter(link => {
      const safeUrl = link.url.startsWith('http://') || link.url.startsWith('https://') ? link.url : 'https://' + link.url
      const url = new URL(safeUrl)
      const pathParts = url.pathname.split('/')
      const commonParentDirectory = pathParts.slice(0, -1).join('/')
      return highHalfOfUniqueCountMapCounts.has(countMap[commonParentDirectory]) && this.testLikelyArticleLinkUrl(link.url)
    })

    const uniqueArticleLinks = articleLinks.filter((link, index) => {
      return articleLinks.findIndex(otherLink => otherLink.url === link.url) === index
    })

    return uniqueArticleLinks
  }

  testLikelyArticleLinkUrl(url: string): boolean {
    url = url.trim().toLowerCase()
    if (url === '') return false

    // if url is 'comments' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/comments[^\dA-Za-z]|[^\dA-Za-z]comments/.test(url)) return false

    // if url is 'comment' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/comment[^\dA-Za-z]|[^\dA-Za-z]comment/.test(url)) return false

    // if url is 'authors' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/authors[^\dA-Za-z]|[^\dA-Za-z]authors/.test(url)) return false

    // if url is 'author' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/author[^\dA-Za-z]|[^\dA-Za-z]author/.test(url)) return false

    // if url is 'category' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/category[^\dA-Za-z]|[^\dA-Za-z]category/.test(url)) return false

    // if url is 'tag' lead or followed by a non-alphanumeric character, it is likely unwanted
    if (/tag[^\dA-Za-z]|[^\dA-Za-z]tag/.test(url)) return false

    return true
  }

  async generateIndexPageJsonFileOfLinks(
    articleLinks: BlogArticleDataProviderLinkType[],
    captureDownloadDirectory: string,
  ): Promise<void> {
    return fs.writeFile(
      path.join(captureDownloadDirectory, 'links.json'),
      JSON.stringify(articleLinks),
      {},
      error => { /* */ },
    )
  }

  async createCapturePartsForArticleLinks(
    schedule: Schedule,
    capture: Capture,
    source: Source,
    articleLinks: BlogArticleDataProviderLinkType[],
  ): Promise<void> {
    let shouldAddArticleLinks = true
    if (source.useStartOrEndCursor === 'start' && source.currentStartCursorUrl != null) shouldAddArticleLinks = false

    let countOfAddedCaptureParts = 0

    const addCapturePart = async (link: BlogArticleDataProviderLinkType, index: number): Promise<boolean> => {
      if (source.useStartOrEndCursor == null) {
        if (await checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl(schedule, link.url)) return true;
      }

      if (
        source.useStartOrEndCursor === 'start' &&
        source?.currentStartCursorUrl === link.url
      ) {
        shouldAddArticleLinks = false
        return false
      }

      if (
        source.useStartOrEndCursor === 'end' &&
        source?.currentEndCursorUrl === link.url
      ) {
        shouldAddArticleLinks = true
        return true
      }

      if (shouldAddArticleLinks) {
        const payload: BlogArticleDataProviderLinkedPagePayloadType = {
          index,
          includes: ['screenshot', 'snapshot', 'metadata'],
          ...link,
        }

        const downloadLocation = path.join(
          capture.downloadLocation,
          this.determineScreenshotFileNameFromLink(payload),
        )

        let capturePart: CapturePart | null = null
        try {
          capturePart = await CapturePart.create({
            status: 'pending' as CapturePartStatus,
            url: link.url,
            dataProviderPartIdentifier: 'linked-page' as BlogArticleDataProviderPartIdentifierType,
            payload: JSON.stringify(payload),
            downloadLocation,
            captureId: capture.id,
          })
        } catch (error) {
          logger.error('A DB error occurred when creating a new Capture Part')
          logger.error(error)
        }

        if (capturePart === null) {
          logger.error(`Capture Part ${index} could not be created: ${link.url}`)
          return true
        }

        countOfAddedCaptureParts += 1
      }

      return true
    }

    // Reminder: returning false will cancel loop, returning true will continue loop
    await articleLinks.every((link, index) => {
      return addCapturePart(link, index)
    })

    if (source.useStartOrEndCursor === 'start') source.currentStartCursorUrl = articleLinks[0].url
    if (source.useStartOrEndCursor === 'end') source.currentEndCursorUrl = articleLinks[articleLinks.length - 1].url
    await source.save()

    logger.info(`Added ${countOfAddedCaptureParts} Capture Parts`)
  }

  /**
   * @throws {Error}
   */
  async processPart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    switch (capturePart.dataProviderPartIdentifier as BlogArticleDataProviderPartIdentifierType) {
    case 'linked-page': return this.processLinkedPagePart(capturePart)
    default: return this.processDefaultPart(capturePart)
    }
  }

  /**
   * @throws {Error}
   */
  async processLinkedPagePart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    const payload: BlogArticleDataProviderLinkedPagePayloadType = JSON.parse(capturePart.payload)

    const browser = await createPuppeteerBrowser()

    const page = await loadPageByUrl(payload.url, browser)

    if (
      capturePart?.capture?.downloadLocation == null || capturePart?.capture?.downloadLocation === '' ||
      capturePart?.downloadLocation == null || capturePart?.downloadLocation === ''
    ) {
      const errorMessage = `No download location found for Capture Part ${capturePart.id}`
      logger.error(errorMessage)

      await page.close()
      await browser.close()

      throw new Error(errorMessage)
    }


    if (fs.existsSync(capturePart.downloadLocation) !== true) {
      fs.mkdirSync(capturePart.downloadLocation, {recursive: true})
    }

    if (fs.lstatSync(capturePart.downloadLocation).isDirectory() === false) {
      const errorMessage = `Download destination '${capturePart.downloadLocation}' is not a directory`
      logger.error(errorMessage)

      await page.close()
      await browser.close()

      throw new Error(errorMessage)
    }

    const screenshotGenerationStatus = payload.includes.includes('screenshot') ? await this.generatePageScreenshot(page, capturePart.downloadLocation) : true
    const snapshotGenerationStatus = payload.includes.includes('snapshot') ? await this.generatePageSnapshot(page, capturePart.downloadLocation) : true
    const metadataGenerationStatus = payload.includes.includes('metadata') ? await this.generatePageMetadata(page, capturePart.downloadLocation) : true

    await page.close()
    await browser.close()

    if (screenshotGenerationStatus !== true) {
      const errorMessage = `Screenshot could not be generated for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (snapshotGenerationStatus !== true) {
      const errorMessage = `Snapshot could not be generated for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (metadataGenerationStatus !== true) {
      const errorMessage = `Metadata could not be generated for Capture Part ${capturePart.id}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    return true
  }

  textIsSuitableForFileName(text: string | false): text is string {
    if (text === false) return false
    if (text == null || text === '') return false
    if (text.length > 50) return false
    if (text.includes('>') || text.includes('<')) return false
    return true
  }

  determineScreenshotFileNameFromLink(link: BlogArticleDataProviderLinkType): string {
    const sanitizedText = safeSanitizeFileName(link.text)
    if (this.textIsSuitableForFileName(sanitizedText)) return sanitizedText

    // eslint-disable-next-line unicorn/prefer-dom-node-text-content
    const sanitizedInnerText = safeSanitizeFileName(link.innerText)
    if (this.textIsSuitableForFileName(sanitizedInnerText)) return sanitizedInnerText

    const sanitizedTitle = safeSanitizeFileName(link.title)
    if (this.textIsSuitableForFileName(sanitizedTitle)) return sanitizedTitle

    const sanitizedAlt = safeSanitizeFileName(typeof link.alt === 'string' ? link.alt : '')
    if (this.textIsSuitableForFileName(sanitizedAlt)) return sanitizedAlt

    const urlParts = link.url.split('/')
    const urlLastPart = urlParts[urlParts.length - 1]
    const sanitizedUrlLastPart = safeSanitizeFileName(urlLastPart)
    if (this.textIsSuitableForFileName(sanitizedUrlLastPart)) return sanitizedUrlLastPart

    return uuidV4()
  }

  /**
   * @throws {Error}
   */
  async processDefaultPart(
    capturePart: CapturePart,
  ): Promise<boolean | never> {
    const errorMessage = `A Data Provider Part '${capturePart.dataProviderPartIdentifier}' could not be found for Data Provider '${capturePart.capture?.schedule?.source?.dataProviderIdentifier}'`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export default BlogArticleDataProvider
