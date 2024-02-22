/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: runImmediateCliCommand.ts
Created:  2024-02-17T16:05:33.827Z
Modified: 2024-02-17T16:05:33.827Z

Description: description
*/

import { exec } from 'node:child_process';
import CliJsonResponse from './CliJsonResponse';
import { ImmediateCliCommandNames } from './types';
import {
  readOnlyInternalMarchiveCliExecutable,
  readOnlyInternalMarchiveCliScriptPath,
} from '../../../paths';
import formatCliCommandOptionsAsCliArguments from './formatCliCommandOptionsAsCliArguments';

/**
 * Run a subcommand of the Marchive CLI binary and asynchronously return the response as a CliJsonResponse.
 */
const runImmediateCliCommand = async <TDataType extends any>(
  command: ImmediateCliCommandNames,
  args: (string | number)[] = [],
  options: Record<string, any> = {},
): Promise<CliJsonResponse<TDataType>> =>
  new Promise((resolve, reject) => {
    exec(
      `${readOnlyInternalMarchiveCliExecutable} ${readOnlyInternalMarchiveCliScriptPath} ${command} ${args.join(' ')} ${formatCliCommandOptionsAsCliArguments(options)} --json`,
      {
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (stderr) {
          reject(new CliJsonResponse<TDataType>(stderr).toError());
        } else {
          const response = new CliJsonResponse<TDataType>(stdout);

          if (response.getSuccess() !== true) return reject(response.toError());

          return resolve(response);
        }
      },
    );
  });

export default runImmediateCliCommand;
