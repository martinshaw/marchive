/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T07:10:52.704Z
Modified: 2024-02-12T07:10:52.704Z

Description: description
*/

import commander from "commander";
import action from ".";

const SourceCreate = new commander.Command("source:create");

SourceCreate.description("Create a new Source")
  .argument("<url>", "Source URL")
  .argument("<dataProviderIdentifier>", "Identifier for the data provider")
  .action(async (url: string, dataProviderIdentifier: string) =>
    action(url, dataProviderIdentifier).then((action) =>
      action.respondToConsole(),
    ),
  );

export default SourceCreate;
