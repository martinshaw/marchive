/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Source } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Source>([
  "schedules",
  "sourceDomain",
]);

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

    const source = await Source.findOne({
      where: {
        id: parseInt(sourceId),
      },
      relations:
        determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ),
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
