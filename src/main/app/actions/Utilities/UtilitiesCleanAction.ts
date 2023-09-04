/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: clean.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import fs from 'node:fs'
import {sequelize, umzug} from '../../../database'
import { downloadCapturesPath } from '../../../../paths'

const UtilitiesCleanAction = async (
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
}

const cleanDownloads = async (): Promise<void> => {
  fs.rmSync(downloadCapturesPath, {recursive: true})
  if (fs.existsSync(downloadCapturesPath)) {
    console.error('Failed to delete capture downloads directory')
    return
  }

  fs.mkdirSync(downloadCapturesPath, {recursive: true})
  if (fs.existsSync(downloadCapturesPath) === false) {
    console.error('Failed to recreate capture downloads directory')
    return
  }
}

export default UtilitiesCleanAction
