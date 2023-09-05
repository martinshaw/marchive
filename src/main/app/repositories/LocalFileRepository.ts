/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: LocalFileRepository.ts
Created:  2023-09-05T15:21:41.210Z
Modified: 2023-09-05T15:21:41.211Z

Description: description
*/

/**
 * When accessing files from the user's file system, we must be careful to only facilitate access to Marchive-related files and
 *   folders (like capture downloads and source domain favicons, etc...). We should not allow access to any other files or
 *   folders on the user's file system.
 *
 * We store absolute paths to files and folders in the database because the user might choose not to store all of their
 *   capture downloads in the single default downloads folder '~/Downloads/marchive' (see paths.ts), due to storage
 *   constraints and preference to store some captures in other locations.
 *
 * But we cannot let the renderer process access the user's file system directly, using the file:// protocol, because
 *   that would allow the renderer process to access any file or folder on the user's file system, which is a
 *   security risk.
 *
 * So either we can read the file within the main process, encode it as a base64 string, then send it to the renderer
 *   using a virtual Sequelize column on the model
 *
 * Or, we can register our own protocol (see https://www.electronjs.org/docs/api/protocol) that will allow the
 *   renderer to access a file, but only if it is within a user configured list of download paths.
 *
 * For now, we will use the first option, because it is simpler, but we might change to the second option if
 *   we find that base64 strings cannot handle suffificently large files.
 */

import fs from 'node:fs'
import path from 'node:path'

const retrieveFileAsBase64DataUrlFromAbsolutePath = async (absolutePath: string): Promise<string|false> => {
