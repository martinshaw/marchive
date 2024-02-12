/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T07:09:44.426Z
Modified: 2024-02-12T07:09:44.426Z

Description: description
*/

import commander from "commander";
import action from ".";

const SourceCount = new commander.Command("source:count");

SourceCount.description("Get the count of Sources").action(action);

export default SourceCount;
