/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:28:38.404Z
Modified: 2024-02-12T06:28:38.404Z

Description: description
*/

import commander from "commander";
import action, {
  addTypeormWhereCommanderOptions,
  addTypeormRelationsCommanderOptions,
} from ".";

let ScheduleList = new commander.Command("schedule:list");

ScheduleList = addTypeormWhereCommanderOptions(ScheduleList);
ScheduleList = addTypeormRelationsCommanderOptions(ScheduleList);

ScheduleList.description("Get Schedules").action(
  async (optionsAndArguments: { [key: string]: string | number | boolean }) =>
    action(optionsAndArguments).then((action) => action.respondToConsole()),
);

export default ScheduleList;
