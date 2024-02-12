/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSetting.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import type CommonEntityType from "./Common";

export const storedSettingKeys = [
  "MARCHIVE_IS_SETUP",
  "ELECTRON_IS_USED",
  "WATCH_SCHEDULES_PROCESS_IS_PAUSED",
  "WATCH_CAPTURE_PARTS_PROCESS_IS_PAUSED",
];
export type StoredSettingKeyType = (typeof storedSettingKeys)[number];

const storedSettingTypes = ["string", "number", "boolean"];
export type StoredSettingTypeType = (typeof storedSettingTypes)[number];

export type StoredSettingEntityType = CommonEntityType & {
  key: StoredSettingKeyType;
  value: string;
  type: StoredSettingTypeType;
};

export default StoredSettingEntityType;
