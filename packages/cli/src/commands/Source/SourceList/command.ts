/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T07:15:39.117Z
Modified: 2024-02-12T07:15:39.117Z

Description: description
*/

import commander from "commander";
import action, {
  addTypeormWhereCommanderOptions,
  addTypeormRelationsCommanderOptions,
} from ".";

let SourceList = new commander.Command("source:list");

SourceList = addTypeormWhereCommanderOptions(SourceList);
SourceList = addTypeormRelationsCommanderOptions(SourceList);

SourceList.description("Get Sources").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) =>
    action(optionsAndArguments).then((action) => action.respondToConsole()),
);

export default SourceList;
