/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderGetFileFromCapturePartDirectoryAction.ts
Created:  2023-08-31T03:18:06.255Z
Modified: 2023-08-31T03:18:06.255Z

Description: description
*/

import path from 'node:path'
import fs from 'node:fs'
import logger from "../../log";
import { CapturePart, Capture } from "../../../database";
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from '../../../../main/app/repositories/LocalFileRepository';

type DataProviderGetFileFromCapturePartDirectoryActionReturnsType = {
  resolvedUrl: string;
  fullPath: string;
}

type DataProviderGetFileFromCapturePartDirectoryActionFileType = 'image' | 'text';

/**
 * @throws {Error}
 */
const DataProviderGetFileFromCapturePartDirectoryAction = async (
  capturePartId: number | null,
  filePath: string,
  fileType: DataProviderGetFileFromCapturePartDirectoryActionFileType
): Promise<DataProviderGetFileFromCapturePartDirectoryActionReturnsType> => {
  if (capturePartId == null) {
    const errorMessage = 'A Capture ID was not provided';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  let capturePart: CapturePart | null = null
  try {
    capturePart = await CapturePart.findByPk(capturePartId)
  } catch (error) {
    logger.error(`A DB error occurred when attempting to find Capture Part ID ${capturePartId} when attempting to get image from capture part directory for path: ${path}`)
    logger.error(error)
  }

  if (capturePart == null) {
    const errorMessage = `No capture part found with ID: ${capturePartId}`
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

  const absolutePath = path.join(capturePart.downloadLocation, filePath)
  if (!path.isAbsolute(absolutePath)) {
    const errorMessage = `The capture part directory path to the desired file is not absolute: ${absolutePath}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Unlikely additional check
  if (!absolutePath.startsWith(capturePart.downloadLocation)) {
    const errorMessage = `The capture part directory path to the desired file is not within the capture part directory: ${absolutePath}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (fs.existsSync(absolutePath) === false) {
    const errorMessage = `A file does not exist at the path: ${absolutePath}`
    logger.warn(errorMessage)
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
        resolvedUrl: imageDataUrl,
        fullPath: absolutePath,
      }

    case 'text':
      const fileContents = fs.readFileSync(absolutePath, 'utf8')

      return {
        resolvedUrl: fileContents,
        fullPath: absolutePath,
      }

    default:
      const errorMessage = `The file type "${fileType}" is not supported in DataProviderGetFileFromCapturePartDirectoryAction`
      logger.error(errorMessage)
      throw new Error(errorMessage)

  }
}

export default DataProviderGetFileFromCapturePartDirectoryAction
