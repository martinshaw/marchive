/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { type ScheduleEntityType } from "./Schedule";
import { type SourceDomainEntityType } from "./SourceDomain";

const sourceUseStartOrEndCursorValues = ["start", "end", null];
export type SourceUseStartOrEndCursorValueType =
  | (typeof sourceUseStartOrEndCursorValues)[number]
  | null;

export type SourceEntityType = {
  dataProviderIdentifier: string;
  url: string;
  name: string | null;
  currentStartCursorUrl: string | null;
  currentEndCursorUrl: string | null;
  useStartOrEndCursor: SourceUseStartOrEndCursorValueType;
  sourceDomain: SourceDomainEntityType;
  schedules: ScheduleEntityType[];
};

export default SourceEntityType;
