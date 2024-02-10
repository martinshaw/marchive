/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CliRequestExector.ts
Created:  2024-02-06T13:42:49.417Z
Modified: 2024-02-06T13:42:49.417Z

Description: description
*/

import { exec } from 'node:child_process';
import {
  readOnlyInternalMarchiveCliExecutable,
  readOnlyInternalMarchiveCliPath,
} from '../../../paths';
import CliJsonResponse from './CliJsonResponse';
import { kebabCase } from 'change-case-commonjs';

type CliCommandNames =
  | 'stored-setting:list'
  | 'stored-setting:get'
  | 'stored-setting:set'
  | 'stored-setting:unset'
  | 'source-domain:list'
  | 'source-domain:show'
  | 'source-domain:count'
  | 'source:list'
  | 'source:show'
  | 'source:count'
  | 'source:create'
  | 'source:delete'
  | 'capture:list'
  | 'capture:show'
  | 'capture:delete'
  | 'data-provider:list'
  | 'data-provider:show'
  | 'data-provider:validate'
  | 'schedule:list'
  | 'schedule:show'
  | 'schedule:count'
  | 'schedule:create'
  | 'schedule:update'
  | 'schedule:delete';

type PerpetualCliCommandNames = 'watch:schedules' | 'watch:capture-parts';

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

const runCliCommand = async <TDataType extends any[] = any[]>(
  command: CliCommandNames,
  args: (string | number)[] = [],
  options: Record<string, any> = {},
): Promise<CliJsonResponse<TDataType>> =>
  new Promise((resolve, reject) => {
    exec(formatCliCommand(command, args, options), (error, stdout, stderr) => {
      if (stderr) resolve(new CliJsonResponse(stderr));
      else resolve(new CliJsonResponse(stdout));
    });
  });

const runPerpetualCliCommand = async (
  command: PerpetualCliCommandNames,
  args: (string | number)[] = [],
  options: Record<string, any> = {},
): Promise<void> => {
  //
};

export { runCliCommand, runPerpetualCliCommand };
