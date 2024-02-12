/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CliIpcCommunicableInstancePool.ts
Created:  2024-02-12T04:34:40.919Z
Modified: 2024-02-12T04:34:40.919Z

Description: description
*/

import logger from 'logger';
import path from 'node:path';
import { ChildProcess, fork } from 'node:child_process';
import GenericPool from 'generic-pool';

const CliIpcCommunicableInstancePool = GenericPool.createPool<ChildProcess>(
  {
    create: async () => {
      const modulePath = path.join(__dirname, 'processor.js');
      const commandProcessor = fork(modulePath);

      logger.debug(`Forked command processor with pid ${commandProcessor.pid}`);

      return commandProcessor;
    },
    destroy: async (commandProcessor) => {
      logger.debug(
        `Destroying command processor with pid ${commandProcessor.pid}`,
      );

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
