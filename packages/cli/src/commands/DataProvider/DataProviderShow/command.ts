/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:18:16.714Z
Modified: 2024-02-12T06:18:16.714Z

Description: description
*/

import commander from "commander";
import action from ".";

let DataProviderShow = new commander.Command("data-provider:show")
  .argument("<data-provider-identifier>", "Data Provider Identifier")
  .description("Get singular Data Providers by Identifier")
  .action(async (dataProviderIdentifier: string) =>
    action(dataProviderIdentifier),
  );

export default DataProviderShow;
