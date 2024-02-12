/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:30:09.200Z
Modified: 2024-02-12T06:30:09.200Z

Description: description
*/

import commander from "commander";
import action, { addTypeormRelationsCommanderOptions } from ".";

let ScheduleShow = new commander.Command("schedule:show");

ScheduleShow = addTypeormRelationsCommanderOptions(ScheduleShow);

ScheduleShow.description("Get singular Schedule by ID")
  .argument("<schedule-id>", "Schedule ID")
  .action(
    async (
      scheduleId: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) => action(scheduleId, optionsAndArguments),
  );

export default ScheduleShow;
