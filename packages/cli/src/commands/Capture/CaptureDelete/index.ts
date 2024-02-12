/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureDelete.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import fs from "node:fs";
import logger from "logger";
import { Capture } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";

const CaptureDelete = async (captureId: string, alsoDeleteFiles?: boolean) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (isNaN(parseInt(captureId)))
      throw new ErrorResponse("Capture ID must be a number");

    let originalCapture: Capture | null = null;
    try {
      originalCapture = await Capture.findOne({
        where: { id: parseInt(captureId) },
        relations: {
          captureParts: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to find Capture ID ${captureId} for deletion`,
        error instanceof Error ? error : null,
      );
    }

    if (originalCapture == null)
      throw new ErrorResponse(`No Capture found with that ID`);

    if (originalCapture.captureParts?.length > 0) {
      originalCapture.captureParts.forEach(async (capturePart) => {
        logger.info("Deleting Capture Part with ID " + capturePart.id);

        await capturePart.softRemove();
      });
    }

    if (alsoDeleteFiles != null) {
      if (
        alsoDeleteFiles === true &&
        originalCapture.downloadLocation != null &&
        fs.existsSync(originalCapture.downloadLocation)
      ) {
        fs.rmSync(originalCapture.downloadLocation, { recursive: true });
      }
    }

    logger.info("Deleting Capture with ID " + originalCapture.id);

    await originalCapture.softRemove();

    let captureCheck: Capture | null = null;
    try {
      captureCheck = await Capture.findOne({
        where: { id: parseInt(captureId) },
      });
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to find Capture ID ${captureId} for check successful deletion`,
        error instanceof Error ? error : null,
      );
    }

    if (captureCheck != null)
      throw new ErrorResponse(`The Capture could not be deleted`);

    return new MessageResponse(
      `Successfully deleted Capture with ID ${captureId}`,
      [
        {
          id: captureId,
        },
      ],
    ).send();
  });
};

export default CaptureDelete;
