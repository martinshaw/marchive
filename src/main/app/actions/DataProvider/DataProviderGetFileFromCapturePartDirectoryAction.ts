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
  text: string;
  fullPath: string;
}

type DataProviderGetFileFromCapturePartDirectoryActionFileType = 'text';

/**
 * TODO : change DataProviderGetFileFromCapturePartDirectoryAction to DataProviderGetTextFromCapturePartDirectoryAction, same with the other action
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
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  switch (fileType) {
    case 'text':
      const fileContents = fs.readFileSync(absolutePath, 'utf8')

      return {
        text: fileContents,
        fullPath: absolutePath,
      }

    default:
      const errorMessage = `The file type "${fileType}" is not supported`
      logger.error(errorMessage)
      throw new Error(errorMessage)

  }
}

export default DataProviderGetFileFromCapturePartDirectoryAction
