/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: RssFeedSourceProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import { MaybeElement } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import SimpleWebpageSourceProvider from './SimpleWebpageSourceProvider';

class RssFeedSourceProvider extends SimpleWebpageSourceProvider {
  getIdentifier(): string {
    return 'rss-feed';
  }

  getName(): string {
    return 'RSS Feed';
  }

  getIcon(): IconName | MaybeElement {
    return 'feed';
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith('http://') || url.startsWith('https://')) === false) {
      // eslint-disable-next-line no-param-reassign
      url = `https://${url}`;
    }

    let request: Response | null = null;
    try {
      request = await fetch(url);

      if (request == null) return false;

      if (request.status !== 200) return false;

      const contents = await request.text();

      if (!contents) return false;
      if (contents.indexOf('<rss ') < 0) return false;
    } catch (error) {
      return false;
    }

    return true;
  }

  async performArchival(previousCursor: string | null): Promise<any[] | null> {
    console.log('Performing archival', previousCursor);
    return null;
  }
}

export default RssFeedSourceProvider;
