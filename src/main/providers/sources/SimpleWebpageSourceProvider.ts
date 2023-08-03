/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SimpleWebpageSourceProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import { MaybeElement } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import SourceProvider from './SourceProvider';

class SimpleWebpageSourceProvider extends SourceProvider {
  getIdentifier(): string {
    return 'simple-webpage';
  }

  getName(): string {
    return 'Simple Webpage';
  }

  getIcon(): IconName | MaybeElement {
    return 'globe';
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith('http://') || url.startsWith('https://')) === false) {
      return false;
    }

    const request = await fetch(url);
    if (request.status !== 200) return false;

    const contents = await request.text();

    if (!contents) return false;
    if (contents.indexOf('<body ') < 0) return false;

    return true;
  }

  async performArchival(previousCursor: string | null): Promise<any[] | null> {
    console.log('Performing archival', previousCursor);
    return null;
  }
}

export default SimpleWebpageSourceProvider;
