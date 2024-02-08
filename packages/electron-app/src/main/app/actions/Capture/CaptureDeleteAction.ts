/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import fs from 'node:fs';
import logger from 'logger';
import { rimraf } from 'rimraf';
// import { Capture, CapturePart } from "database"

/**
 * @throws {Error}
 */
const CaptureDeleteAction = async (
  captureId: number,
  alsoDeleteFiles: boolean = false,
): Promise<void> => {
  // let originalCapture: Capture | null = null
  // try {
  //   originalCapture = await Capture.findByPk(captureId, {include: [CapturePart]})
  // } catch (error) {
  //   logger.error(`A DB error occurred when attempting to find Capture ID ${captureId} for deletion`)
  //   logger.error(error)
  // }
  // if (originalCapture == null) {
  //   const errorMessage = 'No Capture found with that ID'
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
  // originalCapture.captureParts.forEach(async (capturePart) => {
  //   logger.info('Deleting Capture Part with ID ' + capturePart.id);
  //   await capturePart.destroy()
  // })
  // if (alsoDeleteFiles === true && originalCapture.downloadLocation != null && fs.existsSync(originalCapture.downloadLocation)) {
  //   await rimraf(originalCapture.downloadLocation)
  // }
  // logger.info('Deleting Capture with ID ' + originalCapture.id)
  // await originalCapture.destroy()
  // let captureCheck: Capture | null = null
  // try {
  //   captureCheck = await Capture.findByPk(captureId)
  // } catch (error) {
  //   logger.error(`A DB error occurred when attempting to find Capture ID ${captureId} for check successful deletion`)
  //   logger.error(error)
  // }
  // if (captureCheck != null) {
  //   const errorMessage = 'The Capture could not be deleted'
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
};

export default CaptureDeleteAction;
