/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: formatCliCommand.ts
Created:  2024-02-17T16:04:22.618Z
Modified: 2024-02-17T16:04:22.618Z

Description: description
*/

import { kebabCase } from 'change-case-commonjs';
import {
  readOnlyInternalMarchiveCliExecutable,
  readOnlyInternalMarchiveCliPath,
} from '../../../paths';

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

const formatCliCommand = (
  command: string,
  args: (string | number)[] = [],
  options: Record<string, any> = {},
  asJson: boolean = true,
): string =>
  `${readOnlyInternalMarchiveCliExecutable} ${readOnlyInternalMarchiveCliPath} ${command} ${args.join(' ')} ${formatCliCommandOptionsAsCliArguments(options)} ${
    asJson ? '--json' : ''
  }`;

export default formatCliCommand;
