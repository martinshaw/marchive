/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:33:54.464Z
Modified: 2024-02-12T08:33:54.464Z

Description: description
*/

import commander from "commander";
import action from ".";

const SourceDomainCount = new commander.Command("source-domain:count");

SourceDomainCount.description("Get the count of Source Domains").action(() =>
  action().then((action) => action.respondToConsole()),
);

export default SourceDomainCount;
