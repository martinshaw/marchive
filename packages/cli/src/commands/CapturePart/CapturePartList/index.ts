/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Capture, CapturePart } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormWhereCommanderOptions,
  determineTypeormWhereObjectFromCommanderOptions,
] = generateTypeormWhereObjectFromCommanderOptions<Capture>({
  id: { type: "integer" },
  status: { type: "string" },
  url: { type: "string" },
  dataProviderPartIdentifier: { type: "string" },
  payload: { type: "string" },
  downloadLocation: { type: "string" },
  currentRetryCount: { type: "integer" },
  deletedFromDownloads: { type: "boolean" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", nullable: true },
  captureId: { type: "integer", nullable: true },
});

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<CapturePart>([
  "capture",
]);

let CapturePartList = async (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const captureParts = await CapturePart.find({
      where:
        determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
      relations:
        determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ),
      order: {
        createdAt: "DESC",
      },
    });

    return new TableResponse<CapturePart>(`Capture Part`, captureParts, {
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

export default CapturePartList;
