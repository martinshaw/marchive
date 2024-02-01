/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: log.ts
Created:  2023-08-30T23:09:46.570Z
Modified: 2023-08-30T23:09:46.570Z

Description: description
*/

import fs from "node:fs";
import { appLogsPath } from "./paths";
import { Logger, createLogger, format, transports } from "winston";
import DailyRotateFile, {
  DailyRotateFileTransportOptions,
} from "winston-daily-rotate-file";

const createWinstonLogger: (serviceName: string) => Logger = (serviceName) => {
  if (fs.existsSync(appLogsPath) === false)
    fs.mkdirSync(appLogsPath, { recursive: true });

  const sharedFileTransportConfig: DailyRotateFileTransportOptions = {
    filename: "%DATE%.log",
    dirname: appLogsPath,
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "7d",
  };

  const combinedFileTransportConfig: DailyRotateFileTransportOptions = {
    ...sharedFileTransportConfig,
    filename: "combined-%DATE%.log",
    handleExceptions: true,
    handleRejections: true,
  };

  const errorFileTransportConfig: DailyRotateFileTransportOptions = {
    ...sharedFileTransportConfig,
    filename: "error-%DATE%.log",
    level: "error",
  };

  /**
   * Notes when logging, the log level methods use an overloading interface to allow for the following uses (signatures) inspired
   *   by https://github.com/winstonjs/winston/blob/master/examples/quick-start.js:
   *
   * 👍 This logs using the 'info' level, the message 'Hello world' and the metadata object {foo: 'bar'}
   * logger.info('Hello world', {foo: 'bar'})
   *
   * Same for the log levels 'error', 'warn', 'help', 'data', 'info', 'debug', 'prompt', 'http', 'verbose', 'input' and 'silly'
   *
   * 👎 The following does not work as expected!
   * logger.info('Hello world', foo)
   *
   * 👍 This ensures that the error's stack trace is logged as well as the error message.
   * logger.error('My custom error message to add context') // then below on its own ...
   * logger.error(error)
   *
   * 👎 The following two uses do NOT work as expected!
   * logger.error('A custom error message', error)
   * logger.error('A custom error message', {error})
   */
  const logger = createLogger({
    /**
     * As long as I am catching the error manually using ErrorResponse.catchErrorsWithErrorResponse(), I don't want to exit
     * the process before rendering the error to std out. This is not recommended by the Winston docs,
     * so I may need to remove this in the future.
     */
    // TODO: Winston doesn't seem to be logging errors at all
    exitOnError: false,
    format: format.combine(
      // TODO: Winston doesn't seem to be logging errors at all
      format.errors({ stack: true }),
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new DailyRotateFile(combinedFileTransportConfig),
      new DailyRotateFile(errorFileTransportConfig),
    ],
  });

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.MARCHIVE_CLI_LOG_TO_CONSOLE === "true"
  ) {
    logger.add(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      })
    );
  }

  return logger;
};

export default createWinstonLogger;
