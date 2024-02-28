/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:09:59.311Z
Modified: 2024-02-12T06:09:59.311Z

Description: description
*/

import commander from "commander";
import action, {
  addTypeormWhereCommanderOptions,
  addTypeormRelationsCommanderOptions,
} from ".";

let CapturePartList = new commander.Command("capture-part:list");

CapturePartList = addTypeormWhereCommanderOptions(CapturePartList);
CapturePartList = addTypeormRelationsCommanderOptions(CapturePartList);

CapturePartList.description("Get Capture Parts").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) =>
    action(optionsAndArguments).then((action) => action.respondToConsole()),
);

export default CapturePartList;
