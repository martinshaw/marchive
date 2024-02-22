/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CliIpcCommunicableInstancePool.ts
Created:  2024-02-12T04:34:40.919Z
Modified: 2024-02-12T04:34:40.919Z

Description: description
*/

import logger from 'logger';
import { ChildProcess, spawn } from 'node:child_process';
import GenericPool from 'generic-pool';
import {
  readOnlyInternalMarchiveCliExecutable,
  readOnlyInternalMarchiveCliScriptPath,
} from '../../../paths';

const CliIpcCommunicableInstancePool = GenericPool.createPool<ChildProcess>(
  {
    create: async () =>
      spawn(
        readOnlyInternalMarchiveCliExecutable,
        [readOnlyInternalMarchiveCliScriptPath, 'utilities:ipc'].filter(
          (s) => s !== '',
        ),
        {
          stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        },
      ),
    destroy: async (commandProcessor) => {
      commandProcessor.removeAllListeners();
      commandProcessor.kill('SIGKILL');
    },
    validate: async (commandProcessor) =>
      commandProcessor.connected && !commandProcessor.killed,
  },
  {
    testOnBorrow: true,
    min: 2, // Depending on your load, set a MINIMUM number of processes that should always be available in the pool
    max: 5, // Depending on your load, set a MAXIMUM number of processes that should always be available in the pool
  },
);

CliIpcCommunicableInstancePool.on('factoryCreateError', logger.error);
CliIpcCommunicableInstancePool.on('factoryDestroyError', logger.error);

export default CliIpcCommunicableInstancePool;
