/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: formatCliCommandOptionsAsCliArguments.ts
Created:  2024-02-17T16:04:22.618Z
Modified: 2024-02-17T16:04:22.618Z

Description: description
*/

import { kebabCase } from 'change-case-commonjs';

const formatCliCommandOptionsAsCliArguments = (
  options: Record<string, any>,
): string =>
  Object.entries(options)
    .map(([key, value]) => {
      key = kebabCase(key);

      if (typeof value === 'boolean') return `--${key}`;
      if (typeof value === 'string') return `--${key}="${value}"`;
      return `--${key}=${value}`;
    })
    .join(' ');

export default formatCliCommandOptionsAsCliArguments;
