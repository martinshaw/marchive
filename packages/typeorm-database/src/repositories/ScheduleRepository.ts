/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleRepository.ts
Created:  2023-08-25T16:47:42.472Z
Modified: 2023-08-25T16:47:42.472Z

Description: description
*/

import logger from "logger";
import { Schedule, Source } from "../..";
import { ScheduleStatus } from "../entities/Schedule";
import { And, IsNull, LessThanOrEqual, Not } from "typeorm";

const retrieveDueSchedules = async (): Promise<Schedule[]> => {
  let dueSchedules: Schedule[] = [];
  try {
    dueSchedules = await Schedule.find({
      where: {
        enabled: true,
        status: "pending",
        nextRunAt: And(
          LessThanOrEqual(new Date().toISOString()),
          Not(IsNull())
        ),
      },
      relations: {
        source: true,
      },
    });
  } catch (error) {
    logger.error("A DB error occurred when attempting to find due Schedules");
    logger.error(error);
  }

  return dueSchedules;
};

export { retrieveDueSchedules };
