/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:39:50.183Z
Modified: 2024-02-12T08:39:50.183Z

Description: description
*/

import commander from "commander";
import action, { addTypeormWhereCommanderOptions } from ".";

let StoredSettingList = new commander.Command("stored-setting:list");

StoredSettingList = addTypeormWhereCommanderOptions(StoredSettingList);

StoredSettingList.description("Get Stored Settings").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) =>
    action(optionsAndArguments).then((action) => action.respondToConsole()),
);

export default StoredSettingList;
