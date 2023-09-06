/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: log.ts
Created:  2023-08-30T23:09:46.570Z
Modified: 2023-08-30T23:09:46.570Z

Description: description
*/

import { createLogger, format, transports } from 'winston'
import { appLogsPath } from '../paths'
import path from 'node:path'

/**
 * Notes when logging, the log level methods use an overloading interface to allow for the following uses (signatures) inspired by https://github.com/winstonjs/winston/blob/master/examples/quick-start.js:
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
  defaultMeta: { service: 'marchive-desktop' },
  transports: [
    new transports.File({ filename: path.join(appLogsPath, 'main-error.log'), level: 'error' }),
    new transports.File({ filename: path.join(appLogsPath, 'main-combined.log') }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

export default logger
