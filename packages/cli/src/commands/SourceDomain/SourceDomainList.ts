/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import commander from "commander";
import { SourceDomain } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../options/generateTypeormRelationsObjectFromCommanderOptions";

const [
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

const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<SourceDomain>([
  "sources",
]);

let SourceDomainList = new commander.Command("source-domain:list");

SourceDomainList = addTypeormWhereCommanderOptions(SourceDomainList);
SourceDomainList = addTypeormRelationsCommanderOptions(SourceDomainList);

SourceDomainList.description("Get Source Domains").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) => {
    ErrorResponse.catchErrorsWithErrorResponse(async () => {
      const sourceDomains = await SourceDomain.find({
        where:
          determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
        relations:
          determineTypeormRelationsObjectFromCommanderOptions(
            optionsAndArguments,
          ),
      });

      return new TableResponse<SourceDomain>(`Source Domain`, sourceDomains, {
        id: "ID",
        name: "Name",
        url: "URL",
        faviconPath: "Favicon Path",
        createdAt: "Created At",
        updatedAt: "Updated At",
        deletedAt: "Deleted At",
      }).send();
    });
  },
);

export default SourceDomainList;
