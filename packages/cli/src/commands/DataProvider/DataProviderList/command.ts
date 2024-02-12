/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:16:53.716Z
Modified: 2024-02-12T06:16:53.716Z

Description: description
*/

import commander from "commander";
import action from ".";

let DataProviderList = new commander.Command("data-provider:list")
  .description("Get Data Providers")
  .action(() => action().then((action) => action.respondToConsole()));

export default DataProviderList;
