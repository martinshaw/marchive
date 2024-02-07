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
import logger from 'logger';
import { kebabCase } from 'change-case-commonjs';

type CliCommandNamesWithImmediateResponses =
  | 'capture:list'
  | 'capture:delete'
  | 'schedule:list'
  | 'schedule:delete'
  | 'schedule:update'
  | 'schedule:create'
  | 'schedule:count'
  | 'source:create'
  | 'source:delete'
  | 'source:list'
  | 'source:count'
  | 'stored-setting:set'
  | 'stored-setting:get'
  | 'stored-setting:list'
  | 'stored-setting:unset'
  | 'data-provider:list'
  | 'data-provider:validate'
  | 'source-domain:count'
  | 'source-domain:list';

type CliCommandNamesWithNonTerminatingResponses =
  | 'watch:schedules'
  | 'watch:capture-parts';

const formatCliCommandOptionsAsCliArguments = (
  options: Record<string, any>,
): string =>
  Object.entries(options)
    .map(([key, value]) => {
      key = kebabCase(key);

      if (typeof value === 'boolean') return `--${key}`;
      return `--${key}="${value}"`;
    })
    .join(' ');

const runCliCommandWithImmediateResponse = async <
  TDataType extends any[] = any[],
>(
  command: CliCommandNamesWithImmediateResponses,
  options: Record<string, any>,
): Promise<CliJsonResponse<TDataType>> =>
  new Promise((resolve, reject) => {
    exec(
      `${readOnlyInternalMarchiveCliExecutable} ${readOnlyInternalMarchiveCliPath} ${command} ${formatCliCommandOptionsAsCliArguments(options)} --json`,
      (error, stdout, stderr) => {
        if (error) {
          logger.error(
            'An error occurred while executing the CLI command (with runCliCommandWithImmediateResponse)',
            {
              command,
              options,
            },
          );
          logger.error(error);

          reject(error);
        }

        if (stderr) resolve(new CliJsonResponse(stderr));
        else resolve(new CliJsonResponse(stdout));
      },
    );
  });

export { runCliCommandWithImmediateResponse };
