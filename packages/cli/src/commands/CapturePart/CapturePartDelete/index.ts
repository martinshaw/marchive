/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartDelete.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import fs from "node:fs";
import logger from "logger";
import { CapturePart } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";

const CapturePartDelete = async (
  capturePartId: string,
  alsoDeleteFiles?: boolean,
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (isNaN(parseInt(capturePartId)))
      throw new ErrorResponse("Capture Part ID must be a number");

    let originalCapturePart: CapturePart | null = null;
    try {
      originalCapturePart = await CapturePart.findOne({
        where: { id: parseInt(capturePartId) },
      });
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to find Capture Part ID ${capturePartId} for deletion`,
        error instanceof Error ? error : null,
      );
    }

    if (originalCapturePart == null)
      throw new ErrorResponse(`No Capture Part found with that ID`);

    if (alsoDeleteFiles != null) {
      if (
        alsoDeleteFiles === true &&
        originalCapturePart.downloadLocation != null &&
        fs.existsSync(originalCapturePart.downloadLocation)
      ) {
        fs.rmSync(originalCapturePart.downloadLocation, { recursive: true });
      }
    }

    logger.info("Deleting Capture Part with ID " + originalCapturePart.id);

    await originalCapturePart.softRemove();

    let capturePartCheck: CapturePart | null = null;
    try {
      capturePartCheck = await CapturePart.findOne({
        where: { id: parseInt(capturePartId) },
      });
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to find Capture Part ID ${capturePartId} for check successful deletion`,
        error instanceof Error ? error : null,
      );
    }

    if (capturePartCheck != null)
      throw new ErrorResponse(`The Capture Part could not be deleted`);

    return new MessageResponse(
      `Successfully deleted Capture Part with ID ${capturePartId}`,
      [
        {
          id: capturePartId,
        },
      ],
    );
  });
};

export default CapturePartDelete;
