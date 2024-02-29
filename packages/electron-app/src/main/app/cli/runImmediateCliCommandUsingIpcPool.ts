/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: runCliCommandUsingIpcPool.ts
Created:  2024-02-06T13:42:49.417Z
Modified: 2024-02-06T13:42:49.417Z

Description: description

@see https://www.alexanderlolis.com/node-js-fork-is-slow-deal-with-it
*/

import CliIpcCommunicableInstancePool from './CliIpcCommunicableInstancePool';
import CliJsonResponse from './CliJsonResponse';
import { ImmediateCliCommandNames } from 'common-types/src/cli/commands';
import { JSONValue } from 'types-json';

/**
 * CliIpcCommunicableInstancePool keeps a number of forked executions of the CLI binary using the `utilities:ipc` subcommand.
 *
 * runCliCommandUsingIpcPool sends a message to one of those instances and returns the output, emulating the separate
 *   execution of a CLI command without the significant speed overhead of forking a new process.
 *
 * Because we want to keep the finite number of forked processes freed up for subsequent messages, we will only
 *   allow "immediate" commands to be run in this way. This describes commands which return a result without
 *   entering a while-loop or similar mechanism for prolonged execution.
 */
const runImmediateCliCommandUsingIpcPool = async <TDataType extends any>(
  command: ImmediateCliCommandNames,
  functionArgs: JSONValue[] = [],
): Promise<CliJsonResponse<TDataType>> => {
  const commandProcessor = await CliIpcCommunicableInstancePool.acquire();

  try {
    const commandProcessorTask: () => Promise<
      CliJsonResponse<TDataType>
    > = () =>
      new Promise((resolve, reject) => {
        commandProcessor.removeAllListeners();

        // https://nodejs.org/api/child_process.html#child_process_event_error
        commandProcessor.on('error', reject);

        commandProcessor.on('message', (message) => {
          let messageSerialized: string;
          if (typeof message !== 'string')
            messageSerialized = JSON.stringify(message);
          else messageSerialized = message;

          const response = new CliJsonResponse<TDataType>(messageSerialized);

          if (response.getSuccess() !== true) {
            return reject(response.toError());
          }

          return resolve(response);
        });

        commandProcessor.send({
          command,
          args: functionArgs,
        });
      });

    const result = await commandProcessorTask();

    return result;
  } finally {
    // Make sure that the command processor is returned to the pool no matter what happened
    await CliIpcCommunicableInstancePool.release(commandProcessor);
  }
};

export default runImmediateCliCommandUsingIpcPool;
