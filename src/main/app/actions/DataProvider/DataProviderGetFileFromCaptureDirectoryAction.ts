/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderGetFileFromCaptureDirectoryAction.ts
Created:  2023-08-31T03:18:06.255Z
Modified: 2023-08-31T03:18:06.255Z

Description: description
*/

import path from 'node:path'
import fs from 'node:fs'
import logger from "../../log";
import { Capture } from "../../../database";
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from '../../../../main/app/repositories/LocalFileRepository';

type DataProviderGetFileFromCaptureDirectoryActionReturnsType = {
  imageDataUrl: string;
  fullPath: string;
}

type DataProviderGetFileFromCaptureDirectoryActionFileType = 'image';

/**
 * @throws {Error}
 */
const DataProviderGetFileFromCaptureDirectoryAction = async (
  captureId: number | null,
  filePath: string,
  fileType: DataProviderGetFileFromCaptureDirectoryActionFileType
): Promise<DataProviderGetFileFromCaptureDirectoryActionReturnsType> => {
  if (captureId == null) {
    const errorMessage = 'A Capture ID was not provided';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  let capture: Capture | null = null
  try {
    capture = await Capture.findByPk(captureId)
  } catch (error) {
    logger.error(`A DB error occurred when attempting to find Capture ID ${captureId} when attempting to get image from capture directory for path: ${path}`)
    logger.error(error)
  }

  if (capture == null) {
    const errorMessage = `No capture found with ID: ${captureId}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const hasUnallowedSymbolsInPath =
    filePath.includes('..') ||
    filePath.includes('./') ||
    filePath.includes('.\\') ||
    filePath.includes('..\\') ||
    filePath.includes('\\\\') ||
    filePath.includes('//') ||
    filePath.includes(':/') ||
    filePath.includes(':\\') ||
    filePath.includes(':\\\\') ||
    filePath.includes('://')
  if (hasUnallowedSymbolsInPath) {
    const errorMessage = `The file path contains unallowed symbols: ${filePath}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const absolutePath = path.join(capture.downloadLocation, filePath)
  if (!path.isAbsolute(absolutePath)) {
    const errorMessage = `The capture directory path to the desired file is not absolute: ${absolutePath}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Unlikely additional check
  if (!absolutePath.startsWith(capture.downloadLocation)) {
    const errorMessage = `The capture directory path to the desired file is not within the capture directory: ${absolutePath}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (fs.existsSync(absolutePath) === false) {
    const errorMessage = `A file does not exist at the path: ${absolutePath}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  switch (fileType) {
    case 'image':
      const imageDataUrl = retrieveFileAsBase64DataUrlFromAbsolutePath(absolutePath);
      if (imageDataUrl == null) {
        const errorMessage = `A Base64 data URL could not be retrieved for the file at path: ${absolutePath}`
        logger.error(errorMessage)
        throw new Error(errorMessage)
      }

      return {
        imageDataUrl,
        fullPath: absolutePath,
      }

    default:
      const errorMessage = `The file type "${fileType}" is not supported`
      logger.error(errorMessage)
      throw new Error(errorMessage)

  }
}

export default DataProviderGetFileFromCaptureDirectoryAction
