/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ProcessStartProcessAction.ts
Created:  2023-09-06T05:25:10.602Z
Modified: 2023-09-06T05:25:10.602Z

Description: description
*/

import fs from 'node:fs';
import logger from 'logger';
import path from 'node:path';
import { webContents } from 'electron';
import { ChildProcess, fork } from 'node:child_process';
import { readOnlyInternalRootPath } from '../../../../paths';
import { chunksToLinesAsync, chomp } from '@rauschma/stringio';
// import { ProcessDetailsNameType, getProcessDetailPath, processDetails } from '../../processes';

export type ProcessStartProcessActionConnectionInfoReturnType = {
  connected: boolean;
  pid: number | undefined;
  exitCode: number | null;
};

export type ProcessesReplyOngoingEventDataType = {
  origin: 'stderr' | 'stdout' | null;
  event:
    | 'close'
    | 'data'
    | 'end'
    | 'error'
    | 'pause'
    | 'readable'
    | 'resume'
    | 'exit'
    | 'message'
    | 'disconnect'
    | 'spawn';
  data: any | null;
};

const ProcessStartProcessAction = async (
  // processDetailName: ProcessDetailsNameType,
  processDetailName: string,
  processConnectedChannelName: string,
  processOngoingEventChannelName: string,
  processConnectionErrorChannelName: string,
  onStartup: (childProcess: ChildProcess) => void,
): Promise<false | ProcessStartProcessActionConnectionInfoReturnType> => {
  return new Promise((resolve, reject) => {
    // if (
    //   typeof process.versions['electron'] === 'undefined' &&
    //   process.type !== 'browser'
    // ) {
    //   // In reality, this can technically be called from the renderer process also, but it will launch an additional window in the MacOS dock.
    //   return reject(
    //     new Error(
    //       'ProcessStartProcessAction: This function can only be called from the main process.'
    //     )
    //   );
    // }

    // // TODO: Remove or improve when when I have finished testing refactor
    // logger.info('ProcessStartProcessAction: Starting Process: ', {
    //   processDetailName,
    //   processDetails,
    // });

    // const processDetail = processDetails.find(
    //   (processDetail) => processDetail.name === processDetailName
    // );
    // if (typeof processDetail === 'undefined' || processDetail == null) {
    //   // TODO: Remove when when I have finished testing refactor
    //   logger.error('ProcessStartProcessAction: Could not find process: ', {
    //     processDetailName,
    //   })

    //   return reject(
    //     new Error(
    //       `Could not find the detail for a process with the name ${processDetailName} when attempting to start it.`
    //     )
    //   );
    // }

    // logger.info('ProcessStartProcessAction: Found process to be started: ', {
    //   processDetailName,
    //   processDetail,
    // });

    // let processDetailExecutablePath = path.join(
    //   readOnlyInternalRootPath,
    //   'node_modules',
    //   '.bin',
    //   'ts-node' + (process.platform === 'win32' ? '.cmd' : '')
    // );

    // const [processDetailScriptPath, processDetailWorkingDirectoryPath] = getProcessDetailPath(processDetail)

    // logger.info('ProcessStartProcessAction: Has the script file', {
    //   root: processDetailWorkingDirectoryPath,
    //   path: processDetailScriptPath,
    //   pathExists: fs.existsSync(processDetailScriptPath),
    //   executablePath: processDetailExecutablePath,
    //   executablePathExists: fs.existsSync(processDetailExecutablePath),
    // });

    // const childProcess = fork(processDetailScriptPath, [], {
    //   stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    //   execPath: processDetailExecutablePath,
    //   cwd: processDetailWorkingDirectoryPath,
    //   env: { ...process.env },
    // });

    // process?.stdin?.resume();

    // childProcess.stderr?.on('data', async (buffer) => {
    //   logger.info(processDetailName + ': stderr data: ', {
    //     text: buffer.toString(),
    //   });
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'data',
    //       data: buffer.toString(),
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('data', async (buffer) => {
    //   logger.info(processDetailName + ': stdout data: ', {
    //     text: buffer.toString(),
    //   });
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'data',
    //       data: buffer.toString(),
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stderr?.on('close', () => {
    //   logger.info(processDetailName + ': stderr close');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'close',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('close', () => {
    //   logger.info(processDetailName + ': stdout close');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'close',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stderr?.on('end', () => {
    //   logger.info(processDetailName + ': stderr end');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'end',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('end', () => {
    //   logger.info(processDetailName + ': stdout end');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'end',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stderr?.on('error', (error) => {
    //   logger.error(processDetailName + ': stderr error');
    //   logger.error(error);
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'error',
    //       data: error.message,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('error', (error) => {
    //   logger.error(processDetailName + ': stdout error');
    //   logger.error(error);
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'error',
    //       data: error.message,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stderr?.on('pause', () => {
    //   logger.info(processDetailName + ': stderr pause');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'pause',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('pause', () => {
    //   logger.info(processDetailName + ': stdout pause');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'pause',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stderr?.on('readable', async () => {
    //   logger.info(processDetailName + ': stderr readable');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'readable',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('readable', async () => {
    //   logger.info(processDetailName + ': stdout readable');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'readable',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stderr?.on('resume', async () => {
    //   if (childProcess.stderr == null) return;

    //   let lines: string[] = [];
    //   for await (const line of chunksToLinesAsync(childProcess.stderr)) {
    //     lines.push(chomp(line));
    //   }
    //   logger.info(processDetailName + ': stderr resume');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stderr',
    //       event: 'resume',
    //       data: lines,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.stdout?.on('resume', async () => {
    //   if (childProcess.stdout == null) return;

    //   let lines: string[] = [];
    //   for await (const line of chunksToLinesAsync(childProcess.stdout)) {
    //     lines.push(chomp(line));
    //   }

    //   logger.info(processDetailName + ': stdout resume');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: 'stdout',
    //       event: 'resume',
    //       data: lines,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.on('close', (exitCode) => {
    //   logger.info(processDetailName + ': close: ', { exitCode });
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: null,
    //       event: 'close',
    //       data: exitCode,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.on('error', (error) => {
    //   logger.error(processDetailName + ': error');
    //   logger.error(error);
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: null,
    //       event: 'error',
    //       data: error,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.on('exit', (exitCode) => {
    //   logger.info(processDetailName + ': exit: ', { exitCode });
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: null,
    //       event: 'exit',
    //       data: exitCode,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.on('message', (message) => {
    //   logger.info(processDetailName + ': message: ', { message });
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: null,
    //       event: 'message',
    //       data: message,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.on('disconnect', () => {
    //   logger.info(processDetailName + ': disconnect');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: null,
    //       event: 'disconnect',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // childProcess.on('spawn', () => {
    //   logger.info(processDetailName + ': spawn');
    //   webContents.getAllWebContents().forEach((webContent) => {
    //     webContent.send(processOngoingEventChannelName, {
    //       origin: null,
    //       event: 'spawn',
    //       data: null,
    //     } as ProcessesReplyOngoingEventDataType);
    //   });
    // });

    // onStartup(childProcess);

    // const connectionInfo: ProcessStartProcessActionConnectionInfoReturnType = {
    //   connected: childProcess.connected,
    //   pid: childProcess.pid,
    //   exitCode: childProcess.exitCode,
    // };

    // logger.info(
    //   'ProcessStartProcessAction: Starting Process (' +
    //     processDetailName +
    //     '): ',
    //   { connectionInfo }
    // );

    // return resolve(connectionInfo);

    return resolve(false);
  })
    .then((connectionInfo) => {
      // webContents.getAllWebContents().forEach((webContent) => {
      //   webContent.send(processConnectedChannelName, connectionInfo);
      // });

      return connectionInfo as ProcessStartProcessActionConnectionInfoReturnType;
    })
    .catch((error) => {
      // webContents.getAllWebContents().forEach((webContent) => {
      //   webContent.send(processConnectionErrorChannelName, error.message);
      // });

      return false;
    });
};

export default ProcessStartProcessAction;
