/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: PuppeteerDataProviderHelperFunctions.ts
Created:  2023-08-23T10:45:57.404Z
Modified: 2023-08-23T10:45:57.404Z

Description: description
*/

import path from 'node:path'
import puppeteer from 'puppeteer-extra'
import {Browser, Page} from 'puppeteer-core'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { internalNodeModulesPath } from '../../../../paths'
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import {Options, scrollPageToBottom} from 'puppeteer-autoscroll-down'
import { GetWebsiteFaviconResultIconTypeWithNonunknownSrc } from '../../../app/repositories/SourceDomainRepository'

export const createPuppeteerBrowser = async (
  withPopUpOffExtension = true,
  withStealthPlugin = true,
  withAdblockerPlugin = true,
  headless = true,
): Promise<Browser> => {
  let browserArguments: string[] = []
  const extensionFileNames = [

    // For handling removal of overlays, cookie banners, etc... using my own popupoff-headless forked extension
    withPopUpOffExtension ? path.join(internalNodeModulesPath, 'popupoff-headless') : null,

  ].filter(filename => filename !== null)

  const listOfExtensionfileNames = extensionFileNames.join(',')
  if (listOfExtensionfileNames.length > 0) {
    browserArguments = [
      `--disable-extensions-except=${listOfExtensionfileNames}`,
      `--load-extension=${listOfExtensionfileNames}`,
    ]
  }

  // Add stealth plugin (of puppeteer-extra) and use defaults (all tricks to hide puppeteer usage)
  if (withStealthPlugin) puppeteer.use(StealthPlugin())

  // Add adblocker plugin (of puppeteer-extra) to block all ads and trackers (saves bandwidth)
  if (withAdblockerPlugin) puppeteer.use(AdblockerPlugin({blockTrackers: true}))

  if (!headless) console.warn('!!! DO NOT USE PUPPETEER IN NON-HEADLESS MODE DURING PRODUCTION !!!')

  const browser = puppeteer.launch({
    headless: headless ? 'new' : false,
    args: browserArguments,
  })

  return browser
}

export const loadPageByUrl = async (
  url: string,
  browser: Browser,
  // @see https://cloudlayer.io/blog/puppeteer-waituntil-options/#
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2' = 'networkidle0',
  timeout: number = 0,
  width: number = 1280,
  height: number = 800,
): Promise<Page> => {
  const page = await browser.newPage()
  await page.setViewport({width, height})
  await page.goto(url, { waitUntil, timeout })
  return page
}

export const scrollPageToTop = async (page: Page): Promise<unknown> => {
  return page.evaluate(() => {
    window.scrollTo(0, 0)
  })
}

export const smoothlyScrollPageToBottom = async (page: Page, options: Options = {}): Promise<number> => {
  // I have no idea what the issue is here, I may be able to uninstall puppeteer-core if that isn't fixing the problem here
  return scrollPageToBottom(
    // @ts-ignore
    page,
    {
      ...options,
    },
  )
}

export type PageHeadMetadata = {
  title: string | null,
  description: string | null,
  keywords: string | null,
  ogTitle: string | null,
  ogDescription: string | null,
  ogImage: string | null,
  ogUrl: string | null,
  ogSiteName: string | null,
  ogType: string | null,
  ogLocale: string | null,
  ogLocaleAlternate: string | null,
  ogVideo: string | null,
  ogVideoSecureUrl: string | null,
  ogVideoType: string | null,
  ogVideoWidth: string | null,
  ogVideoHeight: string | null,
  ogImageSecureUrl: string | null,
  ogImageType: string | null,
  ogImageWidth: string | null,
  ogImageHeight: string | null,
  ogImageAlt: string | null,
  ogAudio: string | null,
  ogAudioSecureUrl: string | null,
  ogAudioType: string | null,
  ogAudioWidth: string | null,
  ogAudioHeight: string | null,
  ogDeterminer: string | null,
  themeColor: string | null,
  twitterCard: string | null,
  twitterSite: string | null,
  twitterCreator: string | null,
  twitterTitle: string | null,
  twitterDescription: string | null,
  twitterImage: string | null,
  twitterImageAlt: string | null,
  twitterPlayer: string | null,
  twitterPlayerWidth: string | null,
  twitterPlayerHeight: string | null,
  twitterPlayerStream: string | null,
  twitterPlayerStreamContentType: string | null,
  name: string | null,
  itemprop: string | null,
  itemtype: string | null,
  itemscope: string | null,
  itemref: string | null,
  itemid: string | null,
  msApplicationTileImage: string | null,
  msApplicationTileColor: string | null,
  articlePublishedTime: string | null,
  articleModifiedTime: string | null,
  articleExpirationTime: string | null,
  articleSection: string | null,
  articleOpinion: string | null,
  newsKeywords: string | null,
  articleTags: string[] | null,
  articleAuthors: string[] | null,
}

export const retrievePageHeadMetadata = async (page: Page): Promise<PageHeadMetadata> => {
  return page.evaluate(() => {
    const metadata: Partial<PageHeadMetadata> = {}

    const titleElement = document.querySelector('title')
    // eslint-disable-next-line unicorn/prefer-dom-node-text-content
    if (titleElement != null) metadata.title = titleElement.innerText

    const metaTagsToInclude = [
      {selector: 'description', key: 'description'},
      {selector: 'keywords', key: 'keywords'},
      {selector: 'og:title', key: 'ogTitle'},
      {selector: 'og:description', key: 'ogDescription'},
      {selector: 'og:image', key: 'ogImage'},
      {selector: 'og:url', key: 'ogUrl'},
      {selector: 'og:site_name', key: 'ogSiteName'},
      {selector: 'og:type', key: 'ogType'},
      {selector: 'og:locale', key: 'ogLocale'},
      {selector: 'og:locale:alternate', key: 'ogLocaleAlternate'},
      {selector: 'og:video', key: 'ogVideo'},
      {selector: 'og:video:secure_url', key: 'ogVideoSecureUrl'},
      {selector: 'og:video:type', key: 'ogVideoType'},
      {selector: 'og:video:width', key: 'ogVideoWidth'},
      {selector: 'og:video:height', key: 'ogVideoHeight'},
      {selector: 'og:image:secure_url', key: 'ogImageSecureUrl'},
      {selector: 'og:image:type', key: 'ogImageType'},
      {selector: 'og:image:width', key: 'ogImageWidth'},
      {selector: 'og:image:height', key: 'ogImageHeight'},
      {selector: 'og:image:alt', key: 'ogImageAlt'},
      {selector: 'og:audio', key: 'ogAudio'},
      {selector: 'og:audio:secure_url', key: 'ogAudioSecureUrl'},
      {selector: 'og:audio:type', key: 'ogAudioType'},
      {selector: 'og:audio:width', key: 'ogAudioWidth'},
      {selector: 'og:audio:height', key: 'ogAudioHeight'},
      {selector: 'og:determiner', key: 'ogDeterminer'},
      {selector: 'theme-color', key: 'themeColor'},
      {selector: 'twitter:card', key: 'twitterCard'},
      {selector: 'twitter:site', key: 'twitterSite'},
      {selector: 'twitter:creator', key: 'twitterCreator'},
      {selector: 'twitter:title', key: 'twitterTitle'},
      {selector: 'twitter:description', key: 'twitterDescription'},
      {selector: 'twitter:image', key: 'twitterImage'},
      {selector: 'twitter:image:alt', key: 'twitterImageAlt'},
      {selector: 'twitter:player', key: 'twitterPlayer'},
      {selector: 'twitter:player:width', key: 'twitterPlayerWidth'},
      {selector: 'twitter:player:height', key: 'twitterPlayerHeight'},
      {selector: 'twitter:player:stream', key: 'twitterPlayerStream'},
      {selector: 'twitter:player:stream:content_type', key: 'twitterPlayerStreamContentType'},
      {selector: 'name', key: 'name'},
      {selector: 'itemprop', key: 'itemprop'},
      {selector: 'itemtype', key: 'itemtype'},
      {selector: 'itemscope', key: 'itemscope'},
      {selector: 'itemref', key: 'itemref'},
      {selector: 'itemid', key: 'itemid'},
      {selector: 'msapplication-TileImage', key: 'msApplicationTileImage'},
      {selector: 'msapplication-TileColor', key: 'msApplicationTileColor'},
      {selector: 'article:published_time', key: 'articlePublishedTime'},
      {selector: 'article:modified_time', key: 'articleModifiedTime'},
      {selector: 'article:expiration_time', key: 'articleExpirationTime'},
      {selector: 'article:section', key: 'articleSection'},
      {selector: 'article:opinion', key: 'articleOpinion'},
      {selector: 'news_keywords', key: 'newsKeywords'},
    ] as const

    metaTagsToInclude.forEach(({selector, key}) => {
      const element = document.querySelector('meta[name="' + selector + '"], meta[property="' + selector + '"]')
      if (element != null) metadata[key] = element.getAttribute('content')
    })

    // Some sites use multiple 'article:tag' + 'article:tags' tags and some other sites use one tag with multiple comma-separated values
    const metaArticleTagTagsToInclude = document.querySelectorAll('meta[name="tag"], meta[property="tag"], meta[name="article:tag"], meta[property="article:tag"], meta[name="article:tags"], meta[property="article:tags"], meta[name="parsely-tags"], meta[property="parsely-tags"]')
    metadata.articleTags = []
    Array.from(metaArticleTagTagsToInclude).forEach((element, index) => {
      metadata.articleTags = [...metadata.articleTags ?? [], ...(element.getAttribute('content')?.split(', ') ?? [])]
    })
    metadata.articleTags = metadata.articleTags.filter((tag, index) => metadata.articleTags?.indexOf(tag) === index)

    const metaArticleAuthorTagsToInclude = document.querySelectorAll('meta[name="author"], meta[property="author"], meta[name="article:author"], meta[property="article:author"], meta[name="parsely-author"], meta[property="parsely-author"]')
    metadata.articleAuthors = []
    Array.from(metaArticleAuthorTagsToInclude).forEach((element, index) => {
      metadata.articleAuthors = [...metadata.articleAuthors ?? [], ...(element.getAttribute('content')?.split(', ') ?? [])]
    })
    metadata.articleAuthors = metadata.articleAuthors.filter((author, index) => metadata.articleAuthors?.indexOf(author) === index)

    return metadata as PageHeadMetadata
  })
}

export const retrieveFaviconsFromUrl = async (url: string): Promise<GetWebsiteFaviconResultIconTypeWithNonunknownSrc[]> => {
  const browser = await createPuppeteerBrowser()
  const page = await loadPageByUrl(url, browser, 'networkidle0')
  const favicons = await retrieveFaviconsFromPage(page)

  await page.close()
  await browser.close()

  return favicons
}

export const retrieveFaviconsFromPage = async (page: Page): Promise<GetWebsiteFaviconResultIconTypeWithNonunknownSrc[]> => {
  await page.waitForSelector('body')

  return page.evaluate(() => {
    let favicons: GetWebsiteFaviconResultIconTypeWithNonunknownSrc[] = []

    const linkTags = [
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="apple-touch-startup-image"]',
      'link[rel="apple-touch-icon-image"]',
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="fluid-icon"]',
      'link[rel="image_src"]',
      'link[rel="icon shortcut"]',
    ]

    linkTags.forEach(linkTag => {
      const linkTagElements = document.querySelectorAll(linkTag)

      Array.from(linkTagElements).forEach(linkTagElement => {
        if (linkTagElement == null) return;

        const src = linkTagElement.getAttribute('href') || linkTagElement.getAttribute('src') || undefined
        if (typeof src !== 'string') return

        favicons.push({
          sizes: linkTagElement.getAttribute('sizes') || undefined,
          type: linkTagElement.getAttribute('type') || undefined,
          src,
        })
      })
    })

    return favicons
  })
}
