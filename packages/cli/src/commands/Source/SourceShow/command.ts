/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:32:01.124Z
Modified: 2024-02-12T08:32:01.124Z

Description: description
*/

import commander from "commander";
import action, {
  addTypeormRelationsCommanderOptions,
  addTypeormRelationsCommanderOptionsForSchedule,
} from ".";

let SourceShow = new commander.Command("source:show");

SourceShow = addTypeormRelationsCommanderOptions(SourceShow);
SourceShow = addTypeormRelationsCommanderOptionsForSchedule(SourceShow);

SourceShow.description("Get singular Source by ID")
  .argument("<source-id>", "Source ID")
  .action(
    async (
      sourceId: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) =>
      action(sourceId, optionsAndArguments).then((action) =>
        action.respondToConsole(),
      ),
  );

export default SourceShow;
