/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SimpleWebpageScreenshotDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import fs from 'node:fs'
import path from 'node:path'
import logger from '../../../app/log'
import {Browser, Page} from 'puppeteer-core'
import {Capture, CapturePart, Schedule, Source} from '../../../database'
import BaseDataProvider, { AllowedScheduleIntervalReturnType, BaseDataProviderIconInformationReturnType } from '../BaseDataProvider'
import {createPuppeteerBrowser, retrievePageHeadMetadata, scrollPageToTop, smoothlyScrollPageToBottom} from '../helper_functions/PuppeteerDataProviderHelperFunctions'

class SimpleWebpageScreenshotDataProvider extends BaseDataProvider {
  getIdentifier(): string {
    return 'simple-webpage-screenshot'
  }

  getName(): string {
    return 'Simple Webpage Screenshot'
  }

  getDescription(): string {
    return 'Captures a simple screenshot of a webpage'
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath: path.join(__dirname, 'page-layout.svg'),
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

    const page = await browser.newPage()
    await page.setViewport({width: 1280, height: 800})

    await page.goto(
      source.url,
      {
        timeout: 0,
        waitUntil: 'load',
      },
    )

    const firstPageScreenshot = await this.generatePageScreenshot(page, capture.downloadLocation)
    if (firstPageScreenshot === false) {
      const errorMessage = 'The first page screenshot could not be generated'
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

    await page.close()
    await browser.close()

    return true
  }

  async generatePageScreenshot(
    page: Page,
    captureDownloadDirectory: string,
  ): Promise<boolean> {
    await scrollPageToTop(page)
    await smoothlyScrollPageToBottom(page, {})
    await scrollPageToTop(page)

    const indexPageDownloadFileName = path.join(
      captureDownloadDirectory,
      'screenshot.jpg',
    )

    await page.screenshot({
      fullPage: true,
      path: indexPageDownloadFileName,
      quality: 85,
    })

    return fs.existsSync(indexPageDownloadFileName)
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

  /**
   * @throws {Error}
   */
  async processPart(capturePart: CapturePart): Promise<boolean | never> {
    return true
  }
}

export default SimpleWebpageScreenshotDataProvider
