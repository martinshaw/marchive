/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Capture, CapturePart, Schedule, Source } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<CapturePart>([
  "capture",
]);

let CapturePartShow = async (
  capturePartId: string,
  optionsAndArguments: {
    [key: string]: string | number | boolean;
  },
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (isNaN(parseInt(capturePartId))) {
      throw new ErrorResponse("Capture Part ID must be a number");
    }

    const capturePart = await CapturePart.findOne({
      where: {
        id: parseInt(capturePartId),
      },
      relations:
        determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ),
    });

    if (capturePart == null) {
      throw new ErrorResponse("Capture Part not found");
    }

    return new TableResponse<CapturePart>(`Capture Part`, [capturePart], {
      id: "ID",
      status: "Status",
      url: "URL",
      dataProviderPartIdentifier: "Data Provider Part Identifier",
      payload: "Payload",
      downloadLocation: "Download Location",
      currentRetryCount: "Current Retry Count",
      deletedFromDownloads: "Deleted From Downloads",
      createdAt: "Created At",
      updatedAt: "Updated At",
      deletedAt: "Deleted At",
      captureId: "Capture ID",
    });
  });
};

export default CapturePartShow;
