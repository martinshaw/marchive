/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Capture.ts
Created:  2024-01-29T11:27:48.436Z
Modified: 2024-01-29T11:27:48.436Z

Description: description
*/

import { type CapturePartEntityType } from "./CapturePart";
import { type ScheduleEntityType } from "./Schedule";
import type CommonEntityType from "./Common";

export type CaptureEntityType = CommonEntityType & {
  downloadLocation: string;
  allowedRetriesCount: number;
  deletedFromDownloads: boolean;
  schedule: ScheduleEntityType;
  captureParts: CapturePartEntityType[];
};

export default CaptureEntityType;
