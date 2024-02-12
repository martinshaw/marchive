/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Schedule } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Schedule>([
  "source",
  "captures",
]);

let ScheduleShow = async (
  scheduleId: string,
  optionsAndArguments: {
    [key: string]: string | number | boolean;
  },
) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (isNaN(parseInt(scheduleId))) {
      throw new ErrorResponse("Schedule ID must be a number");
    }

    const schedule = await Schedule.findOne({
      where: {
        id: parseInt(scheduleId),
      },
      relations:
        determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ),
    });

    if (schedule == null) {
      throw new ErrorResponse("Schedule not found");
    }

    return new TableResponse<Schedule>(`Schedule`, [schedule], {
      id: "ID",
      status: "Status",
      interval: "Interval",
      lastRunAt: "Last Run At",
      nextRunAt: "Next Run At",
      downloadLocation: "Download Location",
      enabled: "Enabled",
      deletedFromDownloads: "Deleted From Downloads",
      createdAt: "Created At",
      updatedAt: "Updated At",
      deletedAt: "Deleted At",
      sourceId: "Source ID",
    }).send();
  });
};

export default ScheduleShow;
