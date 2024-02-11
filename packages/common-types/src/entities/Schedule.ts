/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Schedule.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { type CaptureEntityType } from "./Capture";
import { type SourceEntityType } from "./Source";
import type CommonEntityType from "./Common";

export const scheduleStatuses = ["pending", "processing", "cancelled"];
export type ScheduleStatus = (typeof scheduleStatuses)[number];

export type ScheduleEntityType = CommonEntityType & {
  status: ScheduleStatus;
  interval: number | null;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
  downloadLocation: string;
  enabled: boolean;
  deletedFromDownloads: boolean;
  source: SourceEntityType;
  captures: CaptureEntityType[];
};

export default ScheduleEntityType;
