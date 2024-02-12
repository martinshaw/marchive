/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:27:26.990Z
Modified: 2024-02-12T06:27:26.990Z

Description: description
*/

import commander from "commander";
import action from ".";

const ScheduleDelete = new commander.Command("schedule:delete");

ScheduleDelete.description("Delete a Schedule")
  .argument("<schedule-id>", "Schedule ID")
  .action(async (scheduleId: string) => action(scheduleId));

export default ScheduleDelete;
