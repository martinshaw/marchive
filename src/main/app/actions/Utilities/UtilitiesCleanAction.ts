/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: clean.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import fs from 'node:fs'
import path from 'node:path'
import {sequelize} from '../../../database'
import { rootPath } from '../../../../paths'

const UtilitiesCleanAction = async (
  database: boolean = false,
  downloads: boolean = false,
): Promise<void> => {
  if (database) await cleanDatabase()
  if (downloads) await cleanDownloads()
}

const cleanDatabase = async (): Promise<unknown[]> => {
  /**
   * For some stupid reason, oclif seems to expect a database to always be connected. Even if I close the connection
   *   (using .close()) before deleting the file, some code somewhere still tries to synchronise the database.
   *
   * Instead of deleting database.db, we will drop all of the table data then allow connection.ts to re-create them
   */

  return sequelize.drop()
}

const cleanDownloads = async (): Promise<void> => {
  await deleteFilesAndDirectories(['downloads'])
  await createFilesAndDirectories(['downloads'], ['downloads/.gitkeep'])
}

const deleteFilesAndDirectories = async (filesAndDirectories: string[]): Promise<void> => {
  filesAndDirectories.forEach(file => {
    const absolutePath = path.join(rootPath, file)

    if (fs.existsSync(absolutePath)) fs.rmSync(absolutePath, {recursive: true})
    if (fs.existsSync(absolutePath)) console.error(`Failed to delete ${file}`)
  })
}

const createFilesAndDirectories = async (directories: string[], files: string[]): Promise<void> => {
  directories.forEach(directory => {
    const absolutePath = path.join(rootPath, directory)

    if (fs.existsSync(absolutePath) === false) fs.mkdirSync(absolutePath, {recursive: true})
    if (fs.existsSync(absolutePath) === false) console.error(`Failed to create ${directory}`)
    if (fs.lstatSync(absolutePath).isDirectory() === false) console.error(`${directory} is not a directory`)
  })

  files.forEach(file => {
    const absolutePath = path.join(rootPath, file)

    if (fs.existsSync(absolutePath)) fs.utimesSync(absolutePath, new Date(), new Date())
    else fs.writeFileSync(absolutePath, '')

    if (fs.existsSync(absolutePath) === false) console.error(`Failed to touch ${file}`)
  })
}

export default UtilitiesCleanAction
