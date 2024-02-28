/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Capture, Schedule, Source } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Capture>([
  "schedule",
  "captureParts",
]);

/**
 * TODO: This is a functioning hack, in the future improve it and its usage by electron-app
 * generateTypeormRelationsObjectFromCommanderOptions should be able to handle nested relations. Presently it doesn't, so I have to shim it in here.
 * I want to be able to use --withScheduleSource and the above commented out line "schedule.source". But this hack makes available --withSource
 */
export const [
  addTypeormRelationsCommanderOptionsForSchedule,
  determineTypeormRelationsObjectFromCommanderOptionsForSchedule,
] = generateTypeormRelationsObjectFromCommanderOptions<Schedule>(["source"]);

/**
 * TODO: This is a functioning hack, in the future improve it and its usage by electron-app
 * generateTypeormRelationsObjectFromCommanderOptions should be able to handle nested relations. Presently it doesn't, so I have to shim it in here.
 * I want to be able to use --withScheduleSourceSourceDomain and the above commented out line "schedule.source.sourceDomain". But this hack makes available --withSourceDomain
 */
export const [
  addTypeormRelationsCommanderOptionsForSource,
  determineTypeormRelationsObjectFromCommanderOptionsForSource,
] = generateTypeormRelationsObjectFromCommanderOptions<Source>([
  "sourceDomain",
]);

let CaptureShow = async (
  captureId: string,
  optionsAndArguments: {
    [key: string]: string | number | boolean;
  },
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (isNaN(parseInt(captureId))) {
      throw new ErrorResponse("Capture ID must be a number");
    }

    const captureRelations =
      determineTypeormRelationsObjectFromCommanderOptions(optionsAndArguments);

    const scheduleRelations =
      determineTypeormRelationsObjectFromCommanderOptionsForSchedule(
        optionsAndArguments,
      );

    const sourceRelations =
      determineTypeormRelationsObjectFromCommanderOptionsForSource(
        optionsAndArguments,
      );

    const capture = await Capture.findOne({
      where: {
        id: parseInt(captureId),
      },
      relations: [
        ...(captureRelations.schedule === true ? ["schedule"] : []),
        ...(captureRelations.captureParts === true ? ["captureParts"] : []),
        ...(scheduleRelations.source === true ? ["schedule.source"] : []),
        ...(sourceRelations.sourceDomain === true
          ? ["schedule.source.sourceDomain"]
          : []),
      ],
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
    });
  });
};

export default CaptureShow;
