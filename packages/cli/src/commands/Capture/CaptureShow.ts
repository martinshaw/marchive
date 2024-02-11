/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import commander from "commander";
import { Capture } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../options/generateTypeormRelationsObjectFromCommanderOptions";

const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Capture>([
  "schedule",
  "captureParts",
]);

let CaptureShow = new commander.Command("capture:show");

CaptureShow = addTypeormRelationsCommanderOptions(CaptureShow);

CaptureShow.description("Get singular Capture by ID")
  .argument("<capture-id>", "Capture ID")
  .action(
    async (
      captureId: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        if (isNaN(parseInt(captureId))) {
          throw new ErrorResponse("Capture ID must be a number");
        }

        const capture = await Capture.findOne({
          where: {
            id: parseInt(captureId),
          },
          relations:
            determineTypeormRelationsObjectFromCommanderOptions(
              optionsAndArguments,
            ),
        });

        if (capture == null) {
          throw new ErrorResponse("Capture not found");
        }

        return new TableResponse<Capture>(`Capture`, [capture], {
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

export default CaptureShow;
