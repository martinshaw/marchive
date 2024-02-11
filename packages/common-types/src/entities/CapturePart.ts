/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePart.ts
Created:  2024-01-29T12:43:22.938Z
Modified: 2024-01-29T12:43:22.939Z

Description: description
*/

import { type CaptureEntityType } from "./Capture";
import type CommonEntityType from "./Common";

const capturePartStatuses = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
];
export type CapturePartStatus = (typeof capturePartStatuses)[number];

export type CapturePartEntityType = CommonEntityType & {
  status: CapturePartStatus;
  url: string;
  dataProviderPartIdentifier: string;
  payload: string;
  downloadLocation: string | null;
  currentRetryCount: number;
  deletedFromDownloads: boolean;
  capture: CaptureEntityType;
};

export default CapturePartEntityType;
