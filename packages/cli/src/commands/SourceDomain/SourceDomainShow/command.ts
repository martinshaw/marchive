/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:36:16.020Z
Modified: 2024-02-12T08:36:16.020Z

Description: description
*/

import commander from "commander";
import action, { addTypeormRelationsCommanderOptions } from ".";

let SourceDomainShow = new commander.Command("source-domain:show");

SourceDomainShow = addTypeormRelationsCommanderOptions(SourceDomainShow);

SourceDomainShow.description("Get singular Source Domain by ID")
  .argument("<source-domain-id>", "Source Domain ID")
  .action(
    async (
      sourceDomainId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) => action(sourceDomainId, optionsAndArguments),
  );

export default SourceDomainShow;
