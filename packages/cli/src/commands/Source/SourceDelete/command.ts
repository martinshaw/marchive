/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T07:12:42.959Z
Modified: 2024-02-12T07:12:42.959Z

Description: description
*/

import commander, { Command } from "commander";
import action from ".";

const SourceDelete = new commander.Command("source:delete");

SourceDelete.description("Delete a Source")
  .argument("<source-id>", "Source ID")
  .option(`--also-delete-files`, "Also delete files associated with Source")
  .action(
    async (
      sourceId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(
        sourceId,
        optionsAndArguments?.alsoDeleteFiles as boolean | undefined,
      ),
  );

export default SourceDelete;
