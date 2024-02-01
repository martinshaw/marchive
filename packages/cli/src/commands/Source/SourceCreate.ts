/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreate.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/
import commander from "commander";
import ErrorResponse from "../../responses/ErrorResponse";
import { Source } from "database";
import logger from "logger";
import MessageResponse from "../../responses/MessageResponse";

const SourceCreate = new commander.Command("source:create");

SourceCreate.description("Create a new source.")
  .argument("<url>", "Source URL")
  .argument("<dataProviderIdentifier>", "Identifier for the data provider")
  .action(async (url, dataProviderIdentifier, program) => {
    ErrorResponse.catchErrorsWithErrorResponse(async () => {
      url = url.trim();
      url =
        url.startsWith("http:") || url.startsWith("https:")
          ? url
          : "https://" + url;

      let existingSource: Source | null = null;
      try {
        existingSource = await Source.findOne({
          where: {
            url,
            dataProviderIdentifier,
          },
        });
      } catch (error) {
        throw new ErrorResponse(
          `A DB error occurred when attempting to check if an existing Source exists when creating a new Source for URL ${url} and Data Provider ${dataProviderIdentifier}`,
          error instanceof Error ? error : null
        );
      }

      return new MessageResponse("ok", [existingSource]).send();
    });
  });

export default SourceCreate;
