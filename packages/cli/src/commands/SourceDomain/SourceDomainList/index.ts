/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Source, SourceDomain } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormWhereCommanderOptions,
  determineTypeormWhereObjectFromCommanderOptions,
] = generateTypeormWhereObjectFromCommanderOptions<SourceDomain>({
  id: { type: "integer" },
  name: { type: "string" },
  url: { type: "string", nullable: true },
  faviconPath: { type: "string", nullable: true },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", nullable: true },
});

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<SourceDomain>([
  "sources",
  // "sources.schedules",
]);

/**
 * TODO: This is a functioning hack, in the future improve it and its usage by electron-app
 * generateTypeormRelationsObjectFromCommanderOptions should be able to handle nested relations. Presently it doesn't, so I have to shim it in here.
 * I want to be able to use --withSourcesSchedules and the above commented out line "sources.schedules". But this hack makes available --withSchedules
 */
export const [
  addTypeormRelationsCommanderOptionsForSource,
  determineTypeormRelationsObjectFromCommanderOptionsForSource,
] = generateTypeormRelationsObjectFromCommanderOptions<Source>(["schedules"]);

let SourceDomainList = async (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const sourceDomains = await SourceDomain.find({
      where:
        determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
      relations: [
        ...(determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ).sources === true
          ? ["sources"]
          : []),
        ...(determineTypeormRelationsObjectFromCommanderOptionsForSource(
          optionsAndArguments,
        ).schedules === true
          ? ["sources.schedules"]
          : []),
      ],
    });

    return new TableResponse<SourceDomain>(`Source Domain`, sourceDomains, {
      id: "ID",
      name: "Name",
      url: "URL",
      faviconPath: "Favicon Path",
      createdAt: "Created At",
      updatedAt: "Updated At",
      deletedAt: "Deleted At",
    });
  });
};

export default SourceDomainList;
