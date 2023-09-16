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
 *   capture downloads in the single default downloads folder '~/Downloads/Marchive' (see paths.ts), due to storage
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
import imageType, { ImageTypeResult } from 'image-type'
import logger from '../log'

const imageExtensionsToMimeTypes: {[key: string]: string} = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
} as const

const audioExtensionsToMimeTypes: {[key: string]: string} = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/m4a',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.wma': 'audio/x-ms-wma',
  '.aiff': 'audio/aiff',
  '.ape': 'audio/ape',
  '.alac': 'audio/alac',
  '.opus': 'audio/opus',
} as const

const videoExtensionsToMimeTypes: {[key: string]: string} = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.mkv': 'video/x-matroska',
  '.flv': 'video/x-flv',
  '.m4v': 'video/x-m4v',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.3gp': 'video/3gpp',
  '.3g2': 'video/3gpp2',
} as const

const retrieveFileAsBase64DataUrlFromAbsolutePath = (absolutePath: string | null): string | null => {
  if (absolutePath == null) return null

  const fileData = fs.readFileSync(absolutePath)
  const fileBase64Content = fileData.toString('base64')
  const fileExtension = path.extname(absolutePath)

  const fileImageDataType = imageType(fileData)
  if (fileImageDataType?.mime != null) return `data:${fileImageDataType.mime};base64,${fileBase64Content}`

  if (fileExtension in imageExtensionsToMimeTypes) return `data:${imageExtensionsToMimeTypes[fileExtension]};base64,${fileBase64Content}`
  if (fileExtension in audioExtensionsToMimeTypes) return `data:${audioExtensionsToMimeTypes[fileExtension]};base64,${fileBase64Content}`
  if (fileExtension in videoExtensionsToMimeTypes) return `data:${videoExtensionsToMimeTypes[fileExtension]};base64,${fileBase64Content}`

  logger.warn(
    'retrieveFileAsBase64DataUrlFromAbsolutePath does not support the file\'s extension. This will need to be implemented!',
    {absolutePath, fileExtension}
  )

  return null
}

export {retrieveFileAsBase64DataUrlFromAbsolutePath}
