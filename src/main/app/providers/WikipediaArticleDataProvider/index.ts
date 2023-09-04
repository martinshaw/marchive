/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: WikipediaArticleDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import puppeteer, {Browser, Page} from 'puppeteer'
import BlogArticleDataProvider, {BlogArticleDataProviderLinkType, CountMapOfCommonParentDirectoriesType} from '../BlogArticleDataProvider'
import {parse as parseHtml} from 'node-html-parser'
import {sentenceCase} from 'change-case'
import path from 'node:path'
import { BaseDataProviderIconInformationReturnType } from '../BaseDataProvider'

class WikipediaArticleDataProvider extends BlogArticleDataProvider {
  getIdentifier(): string {
    return 'wikipedia-article'
  }

  getName(): string {
    return 'Wikipedia Article & Related Articles'
  }

  getDescription(): string {
    return 'Screenshots and snapshots this Wikipedia article and each of its related articles.'
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath: path.join(__dirname, 'wikipedia.png'),
      shouldInvertOnDarkMode: true,
    }
  }

  async determineUrlIsAValidWikipediaUrl(
    url: string,
  ): Promise<false|{url: string, articleName: string}> {
    // See my own highly tested regex based on the quidelines (https://en.wikipedia.org/wiki/Help:URL) in Regex101 at https://regex101.com/r/wRgj8A/1
    const regex = /^((http:|https:){0,1}\/\/.*\.wikipedia\.org){0,1}(\/wiki\/|\/w\/){1}(index\.php\?title=){0,1}(?!User:|Wikipedia:|WP:|Project:|File:|Image:|MediaWiki:|MW:|Template:|Help:|Category:|Portal:|Draft:|TimedText:|Module:|Gadget:|Gadget definition:|Topic:|Education Program:|Book:|WT:|Special:|Wikipedia Talk:|Talk:|H:|CAT:|User talk:|Image Talk:|MOS:|P:|T:|Main_Page)(?<ARTICLENAME>(?!index\.php\?title=)[^&|?|\n]*)[&|?]?.*$/miug

    if (typeof url === 'undefined') return false
    if (url.trim() === '') return false

    let matches
    const validUrls: {url: string, articleName: string}[] = []

    while ((matches = regex.exec(url)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matches.index === regex.lastIndex) {
        regex.lastIndex++
      }

      // The result can be accessed through the `matches`-variable.
      matches.forEach((match, groupIndex) => {
        if (groupIndex === 0) validUrls.push({url: match, articleName: match})
        else if (groupIndex === 5) validUrls[validUrls.length - 1].articleName = sentenceCase(match)
      })
    }

    return validUrls.length > 0 ? validUrls[0] : false
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith('http://') || url.startsWith('https://')) === false) url = `https://${url}`

    const wikipediaInfo = await this.determineUrlIsAValidWikipediaUrl(url)
    if (wikipediaInfo === false) return false

    url = wikipediaInfo.url

    let request: Response | null = null
    try {
      request = await fetch(url)
      if (request === null) return false
      if (request.status !== 200) return false

      const contents = await request.text()
      if (!contents) return false

      const dom = parseHtml(contents)
      if (dom.querySelector('html') == null) return false

      const domBody = dom.querySelector('body')
      if (domBody == null) return false
      if (domBody.classList.contains('action-view') === false) return false
    } catch (error) {
      return false
    }

    return true
  }

  async determineAllLinks(
    page: Page,
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const linkHandles = await page.$$('a')

    const articleLinks: BlogArticleDataProviderLinkType[] = await Promise.all(
      linkHandles
      .map(async link => {
        const wikipediaInfo = await this.determineUrlIsAValidWikipediaUrl(await ((await link?.getProperty('href'))?.jsonValue()))

        if (wikipediaInfo === false) return null

        return {
          url: wikipediaInfo?.url ?? '',
          text: (await ((await link?.getProperty('text'))?.jsonValue())) ?? '',
          innerText: (await ((await link?.getProperty('innerText'))?.jsonValue())) ?? '',
          alt: (await ((await link?.getProperty('alt'))?.jsonValue())) ?? '',
          title: wikipediaInfo?.articleName ?? '',
        }
      })
      .filter(link => link !== null) as Promise<BlogArticleDataProviderLinkType>[],
    )

    return new Promise(resolve => {
      resolve(
        articleLinks.map(link => {
          if (link == null) return null
          if (link.url === '') return null

          if (link.url.includes('#')) {
            const urlWithoutHash = link.url.split('#')[0]
            if (articleLinks.some(otherLink => {
              if (otherLink === null) return false
              if (otherLink.url === '') return false
              if (otherLink.title === link.title && otherLink.title !== '' && otherLink.title != null) return false
              return otherLink?.url === urlWithoutHash
            })) return null
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
    return {}
  }

  async filterLikelyArticleLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType,
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const uniqueArticleLinks = allLinks.filter((link, index) =>
      allLinks.findIndex(otherLink => otherLink.url === link.url) === index,
    )

    return uniqueArticleLinks
  }
}

export default WikipediaArticleDataProvider
