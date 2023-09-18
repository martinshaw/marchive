/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-06T22:28:00.468Z
Modified: 2023-09-06T22:28:00.468Z

Description: description
*/

import winston from "winston";

let logger: winston.Logger | typeof console = console;

/**
 * Child processes forked from the main process do not allow access to the 'electron' module, therefore we do not
 *   have access to the Marchive 'paths.ts' file which depends on the 'electron' module for OS
 *   specific path resolution. Implementing different logger configurations for each type of
 *   process allows us to use the same import statement and similar method
 *   signatures without causing a crash.
 *
 * We might also have to solve this issue in the 'paths.ts' file so that databases can connect during child process,
 *   but I will keep this implementation here because it allows us to simplify the process of retriving stdout
 *   and stderr from child processes, to be dispatched using IPC channels for display in the
 *   user-land renderer process.
 */

if (typeof process.versions['electron'] !== 'undefined' && ['renderer', 'browser'].includes(process.type))
  logger = require('./winston').createWinstonLogger(process.type === 'browser' ? 'main' : process.type)

export default logger
