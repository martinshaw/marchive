/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/
import commander from "commander";
import { Source } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../options/generateTypeormRelationsObjectFromCommanderOptions";

const [
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

const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Source>([
  "schedules",
  "sourceDomain",
]);

let SourceList = new commander.Command("source:list");

SourceList = addTypeormWhereCommanderOptions(SourceList);
SourceList = addTypeormRelationsCommanderOptions(SourceList);

SourceList.description("Get Sources").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) => {
    ErrorResponse.catchErrorsWithErrorResponse(async () => {
      const sources = await Source.find({
        where:
          determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
        relations:
          determineTypeormRelationsObjectFromCommanderOptions(
            optionsAndArguments
          ),
      });

      return new MessageResponse(
        `${sources.length} Source${sources.length === 1 ? "" : "s"} found`,
        sources
      ).send();
    });
  }
);

export default SourceList;
