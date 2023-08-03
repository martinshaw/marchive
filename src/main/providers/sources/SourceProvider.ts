/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceProvider.ts
Created:  2023-08-02T02:29:08.035Z
Modified: 2023-08-02T02:29:08.035Z

Description: description
*/

import { MaybeElement } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

export type SourceProviderSerializedType = {
  identifier: string;
  name: string;
  icon: IconName | MaybeElement;
};

abstract class SourceProvider {
  abstract getIdentifier(): string;

  abstract getName(): string;

  abstract getIcon(): IconName | MaybeElement;

  abstract validateUrlPrompt(url: string): Promise<boolean>;

  abstract performArchival(
    previousCursor: string | null
  ): Promise<any[] | null>;

  toObject(): SourceProviderSerializedType {
    return {
      identifier: this.getIdentifier(),
      name: this.getName(),
      icon: this.getIcon(),
    };
  }
}

export default SourceProvider;
