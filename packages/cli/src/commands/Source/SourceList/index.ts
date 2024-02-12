/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Source } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormWhereCommanderOptions,
  determineTypeormWhereObjectFromCommanderOptions,
] = generateTypeormWhereObjectFromCommanderOptions<Source>({
  id: { type: "integer" },
  dataProviderIdentifier: { type: "string" },
  url: { type: "string" },
  name: { type: "string", nullable: true },
  currentStartCursorUrl: { type: "string", nullable: true },
  currentEndCursorUrl: { type: "string", nullable: true },
  useStartOrEndCursor: {
    type: "string",
    nullable: true,
    values: ["start", "end"],
  },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", nullable: true },
  sourceDomainId: { type: "integer", nullable: true },
});

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Source>([
  "schedules",
  "sourceDomain",
]);

let SourceList = async (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const sources = await Source.find({
      where:
        determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
      relations:
        determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ),
    });

    return new TableResponse<Source>(`Source`, sources, {
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
    }).send();
  });
};

export default SourceList;
