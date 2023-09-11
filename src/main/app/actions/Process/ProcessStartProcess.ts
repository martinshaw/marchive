/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ProcessStartProcess.ts
Created:  2023-09-06T05:25:10.602Z
Modified: 2023-09-06T05:25:10.602Z

Description: description
*/
import fs from 'node:fs'
import path from 'node:path'
import { ChildProcess } from 'node:child_process';
import { fork } from 'child_process';
import { appLogsPath, downloadsPath, internalRootPath, userAppDataPath } from '../../../../paths';
import { ProcessDetailsNameType, processDetails } from '../../processes'
import logger from '../../log';

export type ProcessStartProcessConnectionInfoReturnType = {
  connected: boolean;
  pid: number | undefined;
  exitCode: number | null;
}

const ProcessStartProcess = async (
  processDetailName: ProcessDetailsNameType,
  onStartup: (childProcess: ChildProcess) => void
): Promise<ProcessStartProcessConnectionInfoReturnType> => {
  return new Promise((resolve, reject) => {
    if (typeof process.versions['electron'] === 'undefined' && process.type !== 'browser') {
      // In reality, this can technically be called from the renderer process also, but it will launch an additional window in the MacOS dock.
      return reject(new Error('ProcessStartProcess: This function can only be called from the main process.'))
    }

    const processDetail = processDetails.find(processDetail => processDetail.name === processDetailName)
    if (typeof processDetail === 'undefined' || processDetail == null) {
      return reject(new Error(`Could not find the detail for a process with the name ${processDetailName} when attempting to start it.`))
    }

    logger.info('ProcessStartProcess: Found process to be started: ', { processDetailName, processDetail })

    logger.info('ProcessStartProcess: Has the script file', {exists: fs.existsSync(processDetail.path)})

    const childProcess = fork(
      processDetail.path,
      [],
      {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        execPath: path.join(internalRootPath, 'node_modules', '.bin', 'ts-node'),
        cwd: internalRootPath,
        env: {
          ...process.env,
          USER_APP_DATA_PATH: userAppDataPath,
          DOWNLOADS_PATH: downloadsPath,
          APP_LOGS_PATH: appLogsPath,
        },

        // execPath?: string | undefined;
        // execArgv?: string[] | undefined;
        // silent?: boolean | undefined;
        // /**
        //  * Can be set to 'pipe', 'inherit', 'overlapped', or 'ignore', or an array of these strings.
        //  * If passed as an array, the first element is used for `stdin`, the second for
        //  * `stdout`, and the third for `stderr`. A fourth element can be used to
        //  * specify the `stdio` behavior beyond the standard streams. See
        //  * {@link ChildProcess.stdio} for more information.
        //  *
        //  * @default 'pipe'
        //  */
        // stdio?: StdioOptions | undefined;
        // detached?: boolean | undefined;
        // windowsVerbatimArguments?: boolean | undefined;

        // uid?: number | undefined;
        // gid?: number | undefined;
        // cwd?: string | URL | undefined;
        // env?: NodeJS.ProcessEnv | undefined;

        // /**
        //  * Specify the kind of serialization used for sending messages between processes.
        //  * @default 'json'
        //  */
        // serialization?: SerializationType | undefined;
        // /**
        //  * The signal value to be used when the spawned process will be killed by the abort signal.
        //  * @default 'SIGTERM'
        //  */
        // killSignal?: NodeJS.Signals | number | undefined;
        // /**
        //  * In milliseconds the maximum amount of time the process is allowed to run.
        //  */
        // timeout?: number | undefined;

        // /**
        //  * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
        //  */
        // signal?: AbortSignal | undefined;
      }
    );
    process?.stdin?.resume();

    onStartup(childProcess)

    const connectionInfo: ProcessStartProcessConnectionInfoReturnType = {
      connected: childProcess.connected,
      pid: childProcess.pid,
      exitCode: childProcess.exitCode,
    };

    logger.info('ProcessStartProcess: Starting Process: ', {connectionInfo})

    return resolve(connectionInfo)
  })
}

export default ProcessStartProcess
