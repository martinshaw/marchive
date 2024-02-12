/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:20:55.262Z
Modified: 2024-02-12T06:20:55.262Z

Description: description
*/

import commander from "commander";
import action from ".";

const ScheduleCount = new commander.Command("schedule:count");

ScheduleCount.description("Get the count of Schedules").action(() =>
  action().then((action) => action.respondToConsole()),
);

export default ScheduleCount;
