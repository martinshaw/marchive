/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: log.ts
Created:  2023-08-30T23:09:46.570Z
Modified: 2023-08-30T23:09:46.570Z

Description: description
*/

import { createLogger, format, transports } from 'winston'
import { rootPath } from '../paths'
import path from 'node:path'

const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({
      filename: path.join(
        rootPath,
        'logs',
        'main-error.log'
      ),
      level: 'error'
    }),
    new transports.File({
      filename: path.join(
        rootPath,
        'logs',
        'main-combined.log'
      )
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console());
}

export default logger
