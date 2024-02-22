/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: runPerpetualCliCommand.ts
Created:  2024-02-17T16:05:33.827Z
Modified: 2024-02-17T16:05:33.827Z

Description: description
*/

import { ChildProcess, spawn } from 'node:child_process';
import CliJsonResponse from './CliJsonResponse';
import { PerpetualCliCommandNames } from './types';
import {
  readOnlyInternalMarchiveCliExecutable,
  readOnlyInternalMarchiveCliScriptPath,
} from '../../../paths';
import formatCliCommandOptionsAsCliArguments from './formatCliCommandOptionsAsCliArguments';

/**
 * Run a subcommand of the Marchive CLI binary and asynchronously return the response as a CliJsonResponse.
 */
const runPerpetualCliCommand = (
  command: PerpetualCliCommandNames,
  args: (string | number)[],
  options: Record<string, any>,
  onStdout: (data: string) => void,
  onStderr: (data: string) => void,
  onMessage: (message: any) => void,
  onClose: (code: number | null) => void,
  onSpawn: (childProcess: ChildProcess) => void,
): void => {
  const childProcess = spawn(
    readOnlyInternalMarchiveCliExecutable,
    [
      readOnlyInternalMarchiveCliScriptPath,
      command,
      ...args.map((v) => v.toString()),
      formatCliCommandOptionsAsCliArguments(options),
    ].filter((s) => s !== ''),
    {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      windowsHide: true,
    },
  );

  childProcess.stdout?.on('data', (data) => onStdout(data.toString()));

  childProcess.stderr?.on('data', (data) => onStderr(data.toString()));

  childProcess.on('message', (message) => onMessage(message));

  childProcess.on('close', (code) => onClose(code));

  onSpawn(childProcess);
};

export default runPerpetualCliCommand;
