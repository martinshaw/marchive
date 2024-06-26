/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/
import commander from "commander";
import { SourceDomain } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../options/generateTypeormRelationsObjectFromCommanderOptions";

const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<SourceDomain>([
  "sources",
]);

let SourceDomainShow = new commander.Command("source-domain:show");

SourceDomainShow = addTypeormRelationsCommanderOptions(SourceDomainShow);

SourceDomainShow.description("Get singular Source Domain by ID")
  .argument("<source-domain-id>", "Source Domain ID")
  .action(
    async (
      sourceDomainId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        if (isNaN(parseInt(sourceDomainId))) {
          throw new ErrorResponse("Source Domain ID must be a number");
        }

        const sourceDomain = await SourceDomain.findOne({
          where: { id: parseInt(sourceDomainId) },
          relations:
            determineTypeormRelationsObjectFromCommanderOptions(
              optionsAndArguments,
            ),
        });

        if (sourceDomain == null) {
          throw new ErrorResponse("Source Domain not found");
        }

        return new TableResponse<SourceDomain>(
          `Source Domain`,
          [sourceDomain],
          {
            id: "ID",
            name: "Name",
            url: "URL",
            faviconPath: "Favicon Path",
            createdAt: "Created At",
            updatedAt: "Updated At",
            deletedAt: "Deleted At",
          },
        ).send();
      });
    },
  );

export default SourceDomainShow;
