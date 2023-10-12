/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleRepository.ts
Created:  2023-08-25T16:47:42.472Z
Modified: 2023-08-25T16:47:42.472Z

Description: description
*/

import logger from "logger";
import { Schedule, Source, Op } from "../..";
import { ScheduleStatus } from "../models/Schedule";

const retrieveDueSchedules = async (): Promise<Schedule[]> => {
  let dueSchedules: Schedule[] = [];
  try {
    dueSchedules = await Schedule.findAll({
      where: {
        enabled: true,
        status: {
          [Op.eq]: "pending" as ScheduleStatus,
        },
        nextRunAt: {
          [Op.lte]: new Date().toISOString(),
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Source,
        },
      ],
    });
  } catch (error) {
    logger.error("A DB error occurred when attempting to find due Schedules");
    logger.error(error);
  }

  return dueSchedules;
};

export { retrieveDueSchedules };
