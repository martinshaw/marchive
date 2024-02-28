/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Schedule, Source } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Source>([
  "schedules",
  "sourceDomain",
  // "schedules.captures"
]);

/**
 * TODO: This is a functioning hack, in the future improve it and its usage by electron-app
 * generateTypeormRelationsObjectFromCommanderOptions should be able to handle nested relations. Presently it doesn't, so I have to shim it in here.
 * I want to be able to use --withSchedulesCaptures and the above commented out line "schedules.captures". But this hack makes available --withCaptures
 */
export const [
  addTypeormRelationsCommanderOptionsForSchedule,
  determineTypeormRelationsObjectFromCommanderOptionsForSchedule,
] = generateTypeormRelationsObjectFromCommanderOptions<Schedule>(["captures"]);

let SourceShow = async (
  sourceId: string,
  optionsAndArguments: {
    [key: string]: string | number | boolean;
  },
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (isNaN(parseInt(sourceId))) {
      throw new ErrorResponse("Source ID must be a number");
    }

    const sourceRelations =
      determineTypeormRelationsObjectFromCommanderOptions(optionsAndArguments);

    const scheduleRelations =
      determineTypeormRelationsObjectFromCommanderOptionsForSchedule(
        optionsAndArguments,
      );

    const source = await Source.findOne({
      where: {
        id: parseInt(sourceId),
      },
      relations: [
        ...(sourceRelations.schedules === true ? ["schedules"] : []),
        ...(sourceRelations.sourceDomain === true ? ["sourceDomain"] : []),
        ...(scheduleRelations.captures === true ? ["schedules.captures"] : []),
      ],
    });

    if (source == null) {
      throw new ErrorResponse("Source not found");
    }

    return new TableResponse<Source>(`Source`, [source], {
      id: "ID",
      dataProviderIdentifier: "Data Provider Identifier",
      url: "URL",
      name: "Name",
      currentStartCursorUrl: "Current Start Cursor URL",
      currentEndCursorUrl: "Current End Cursor URL",
      useStartOrEndCursor: "Use Start Or End Cursor",
      createdAt: "Created At",
      updatedAt: "Updated At",
      deletedAt: "Deleted At",
      sourceDomainId: "Source Domain ID",
    });
  });
};

export default SourceShow;
