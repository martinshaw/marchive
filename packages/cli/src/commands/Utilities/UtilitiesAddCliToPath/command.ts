/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:45:12.908Z
Modified: 2024-02-12T08:45:12.908Z

Description: description
*/

import commander from "commander";
import action from ".";

let UtilitiesAddCliToPath = new commander.Command("utilities:add-cli-to-path")
  .description("Add the CLI tool to the system path in your shell terminal")
  .action(async () => action().then((action) => action.respondToConsole()));

export default UtilitiesAddCliToPath;
