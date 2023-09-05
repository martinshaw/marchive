/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilityCleanAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import fs from 'node:fs'
import {sequelize, umzug} from '../../../database'
import { downloadCapturesPath } from '../../../../paths'
import logger from '../../../log'

const UtilityCleanAction = async (
  database: boolean = false,
  downloads: boolean = false,
): Promise<void> => {
  if (database) await cleanDatabase()
  if (downloads) await cleanDownloads()
}

const cleanDatabase = async (): Promise<void> => {
  /**
   * For some stupid reason, oclif seems to expect a database to always be connected. Even if I close the connection
   *   (using .close()) before deleting the file, some code somewhere still tries to synchronise the database.
   *
   * Instead of deleting database.db, we will drop all of the table data then allow connection.ts to re-create them
   */

  // return sequelize.drop()

  /**
   * Nope, now that we are using migrations (see src/main/database/index.ts), we don't want to drop the migration table etc...
   * So we should just roll them all back instead
   */
  await umzug.down({ to: 0 })
  await umzug.up()
}

const cleanDownloads = async (): Promise<void> => {
  const directoriesToClean: {path: string, description: string}[] = [
    { path: downloadCapturesPath, description: 'capture downloads' }
  ]

  for (const directory of directoriesToClean) {
    if (fs.existsSync(directory.path) === false) {
      logger.warn(`The ${directory.description} directory does not exist to be cleaned`)
      continue
    }

    fs.rmSync(directory.path, {recursive: true})
    if (fs.existsSync(directory.path)) {
      logger.error(`Failed to delete the ${directory.description} directory`)
      return
    }

    fs.mkdirSync(directory.path, {recursive: true})
    if (fs.existsSync(directory.path) === false) {
      logger.error(`Failed to recreate the ${directory.description} directory`)
      return
    }

    logger.info(`Successfully cleaned the ${directory.description} directory`)
  }
}

export default UtilityCleanAction
