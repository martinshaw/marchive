/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:19:28.443Z
Modified: 2024-02-12T06:19:28.443Z

Description: description
*/
import commander from "commander";
import action from ".";

let DataProviderValidate = new commander.Command("data-provider:validate")
  .description("Validate Data Providers by URL")
  .argument("<url>", "URL to be validated")
  .action(async (url: string) => action(url));

export default DataProviderValidate;
