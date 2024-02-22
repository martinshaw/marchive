/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: runCliCommand.ts
Created:  2024-02-17T16:05:33.827Z
Modified: 2024-02-17T16:05:33.827Z

Description: description
*/

import { exec } from 'node:child_process';
import CliJsonResponse from './CliJsonResponse';
import formatCliCommand from './formatCliCommand';
import { CliCommandNames } from './types';

/**
 * Run a subcommand of the Marchive CLI binary and asynchronously return the response as a CliJsonResponse.
 */
const runCliCommand = async <TDataType extends any>(
  command: CliCommandNames,
  args: (string | number)[] = [],
  options: Record<string, any> = {},
): Promise<CliJsonResponse<TDataType>> =>
  new Promise((resolve, reject) => {
    exec(
      formatCliCommand(command, args, options),
      {
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (stderr) {
          reject(new CliJsonResponse<TDataType>(stderr).toError());
        } else {
          const response = new CliJsonResponse<TDataType>(stdout);

          if (response.getSuccess() !== true) reject(response.toError());
          else resolve(response);
        }
      },
    );
  });

export default runCliCommand;
