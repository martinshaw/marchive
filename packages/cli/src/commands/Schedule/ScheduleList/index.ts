/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { Schedule } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../../options/generateTypeormWhereObjectFromCommanderOptions";
import generateTypeormRelationsObjectFromCommanderOptions from "../../../options/generateTypeormRelationsObjectFromCommanderOptions";
import { scheduleStatuses } from "common-types/src/entities/Schedule";

export const [
  addTypeormWhereCommanderOptions,
  determineTypeormWhereObjectFromCommanderOptions,
] = generateTypeormWhereObjectFromCommanderOptions<Schedule>({
  id: { type: "integer" },
  status: { type: "string", values: scheduleStatuses },
  interval: { type: "integer", nullable: true },
  lastRunAt: { type: "date", nullable: true },
  nextRunAt: { type: "date", nullable: true },
  downloadLocation: { type: "string" },
  enabled: { type: "boolean" },
  deletedFromDownloads: { type: "boolean" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", nullable: true },
  sourceId: { type: "integer", nullable: true },
});

export const [
  addTypeormRelationsCommanderOptions,
  determineTypeormRelationsObjectFromCommanderOptions,
] = generateTypeormRelationsObjectFromCommanderOptions<Schedule>([
  "source",
  "captures",
]);

let ScheduleList = async (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const schedules = await Schedule.find({
      where:
        determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
      relations:
        determineTypeormRelationsObjectFromCommanderOptions(
          optionsAndArguments,
        ),
    });

    return new TableResponse<Schedule>(`Schedule`, schedules, {
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

export default ScheduleList;
