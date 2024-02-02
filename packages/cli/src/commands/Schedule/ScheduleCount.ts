/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleCount.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/
import commander from "commander";
import { Schedule } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";

const ScheduleCount = new commander.Command("schedule:count");

ScheduleCount.description("Get the count of Schedules").action(
  async (program) => {
    ErrorResponse.catchErrorsWithErrorResponse(async () => {
      const count = await Schedule.count();

      return new MessageResponse(`${count} Schedule${count === 1 ? "" : "s"}`, [
        {
          count,
        },
      ]).send();
    });
  }
);

export default ScheduleCount;
