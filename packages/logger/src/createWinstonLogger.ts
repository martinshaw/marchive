/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: log.ts
Created:  2023-08-30T23:09:46.570Z
Modified: 2023-08-30T23:09:46.570Z

Description: description
*/

import fs from 'node:fs'
import appLogsPath from './logsPath'
import { Logger, createLogger, format, transports } from 'winston'
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file'

const createWinstonLogger: (serviceName: string) => Logger = (serviceName) => {
  if (fs.existsSync(appLogsPath) === false) fs.mkdirSync(appLogsPath, { recursive: true })

  const sharedFileTransportConfig: DailyRotateFileTransportOptions = {
    filename: '%DATE%.log',
    dirname: appLogsPath,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
  }

  const errorFileTransportConfig: DailyRotateFileTransportOptions = { ...sharedFileTransportConfig, filename: 'error-%DATE%.log', level: 'error' }
  const combinedFileTransportConfig: DailyRotateFileTransportOptions = { ...sharedFileTransportConfig, filename: 'combined-%DATE%.log' }

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
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new DailyRotateFile(errorFileTransportConfig),
      new DailyRotateFile(combinedFileTransportConfig),
    ],
  })

  // TODO: Uncomment or keep comments ???
  // if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }));
  // }

  return logger
}

export default createWinstonLogger