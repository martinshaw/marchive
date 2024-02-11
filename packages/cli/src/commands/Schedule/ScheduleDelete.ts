/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleDelete.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import logger from "logger";
import commander, { Command } from "commander";
import { Schedule } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";

const ScheduleDelete = new commander.Command("schedule:delete");

ScheduleDelete.description("Delete a Schedule")
  .argument("<schedule-id>", "Schedule ID")
  .action(
    async (
      scheduleId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
      program: Command,
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        if (isNaN(parseInt(scheduleId)))
          throw new ErrorResponse("Schedule ID must be a number");

        let originalSchedule: Schedule | null = null;
        try {
          originalSchedule = await Schedule.findOne({
            where: { id: parseInt(scheduleId) },
            relations: {
              source: true,
            },
          });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to find Schedule ID ${scheduleId} for deletion`,
            error instanceof Error ? error : null,
          );
        }

        if (originalSchedule == null)
          throw new ErrorResponse(`No Schedule found with that ID`);

        if (originalSchedule.captures?.length > 0) {
          originalSchedule.captures.forEach(async (capture) => {
            logger.info("Deleting Capture with ID " + capture.id);

            await capture.softRemove();
          });
        }

        logger.info("Deleting Schedule with ID " + originalSchedule.id);

        await originalSchedule.softRemove();

        let scheduleCheck: Schedule | null = null;
        try {
          scheduleCheck = await Schedule.findOne({
            where: { id: parseInt(scheduleId) },
          });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to find Schedule ID ${scheduleId} for check successful deletion`,
            error instanceof Error ? error : null,
          );
        }

        if (scheduleCheck != null)
          throw new ErrorResponse(`The Schedule could not be deleted`);

        return new MessageResponse(
          `Successfully deleted Schedule with ID ${scheduleId}`,
          [
            {
              id: scheduleId,
            },
          ],
        ).send();
      });
    },
  );

export default ScheduleDelete;
