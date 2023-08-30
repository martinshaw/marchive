/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: MarchiveCliCommandRepository.ts
Created:  2023-08-29T18:36:41.163Z
Modified: 2023-08-29T18:36:41.163Z

Description: description
*/

import {spawn} from 'child_process'
import path from 'node:path';
import { rootPath } from '../../paths';

export const runMarchiveCliCommand = async (
  args: string[],
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cliPath = path.join(rootPath, 'node_modules', '@martinshaw', 'marchive-cli', 'bin', 'run')
    const cliArguments = [...args, '--json']

    const childProcess = spawn(cliPath, cliArguments)

    let stdout = ''
    let stderr = ''

    childProcess.stdout.on('data', (data) => {
      stdout += data
    })

    childProcess.stderr.on('data', (data) => {
      stderr += data
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(stderr)
      }
    })
  })
}

export default () => {};
