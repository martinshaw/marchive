/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import commander from "commander";
import { Capture, Source } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../options/generateTypeormRelationsObjectFromCommanderOptions";

const [
  addTypeormWhereCommanderOptions,
  determineTypeormWhereObjectFromCommanderOptions,
] = generateTypeormWhereObjectFromCommanderOptions<Capture>({
  id: { type: "integer" },
  downloadLocation: { type: "string" },
  allowedRetriesCount: { type: "integer" },
  deletedFromDownloads: { type: "boolean" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", nullable: true },
  scheduleId: { type: "integer", nullable: true },
});

const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Capture>([
  "schedule",
  "captureParts",
]);

let CaptureList = new commander.Command("capture:list");

CaptureList = addTypeormWhereCommanderOptions(CaptureList);
CaptureList = addTypeormRelationsCommanderOptions(CaptureList);

CaptureList.description("Get Captures").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) => {
    ErrorResponse.catchErrorsWithErrorResponse(async () => {
      const captures = await Capture.find({
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

      return new TableResponse<Capture>(`Capture`, captures, {
        id: "ID",
        downloadLocation: "Download Location",
        allowedRetriesCount: "Allowed Retries Count",
        deletedFromDownloads: "Deleted From Downloads",
        createdAt: "Created At",
        updatedAt: "Updated At",
        deletedAt: "Deleted At",
        scheduleId: "Schedule ID",
      }).send();
    });
  },
);

export default CaptureList;
