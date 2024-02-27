/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:34:52.087Z
Modified: 2024-02-12T08:34:52.087Z

Description: description
*/

import commander from "commander";
import action, {
  addTypeormWhereCommanderOptions,
  addTypeormRelationsCommanderOptions,
  addTypeormRelationsCommanderOptionsForSource,
} from ".";

let SourceDomainList = new commander.Command("source-domain:list");

SourceDomainList = addTypeormWhereCommanderOptions(SourceDomainList);
SourceDomainList = addTypeormRelationsCommanderOptions(SourceDomainList);

/**
 * TODO: This is a functioning hack, in the future improve it and its usage by electron-app
 * See explanation in ./index.ts
 */
SourceDomainList =
  addTypeormRelationsCommanderOptionsForSource(SourceDomainList);

SourceDomainList.description("Get Source Domains").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) =>
    action(optionsAndArguments).then((action) => action.respondToConsole()),
);

export default SourceDomainList;
