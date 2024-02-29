/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-10T06:28:15.735Z
Modified: 2023-10-10T06:28:15.735Z

Description: description
*/

import type CaptureEntityType from "./entities/Capture";
import type CapturePartEntityType from "./entities/CapturePart";
import type ScheduleEntityType from "./entities/Schedule";
import type SourceEntityType from "./entities/Source";
import type SourceDomainEntityType from "./entities/SourceDomain";
import type StoredSettingEntityType from "./entities/StoredSetting";
import {
  type DataProviderSerializedType,
  type SourceDomainInformationReturnType,
  type AllowedScheduleIntervalReturnType,
  type BaseDataProviderIconInformationReturnType,
} from "./data-providers/BaseDataProvider";

/**
 * Do not add new exports to this file. Instead, refer to their respective files directly.
 * While this concern doesn't affect 'types', which are not included in compiled code,
 *   it is a potentially bad practice to bundle exports into a single importable
 *   module because if the chosen bundler doesn't tree-shake, unused exports
 *   will be included in the final bundle massively increasing its size.
 *
 * TODO: Remove this and its references in the future ?
 */

export {
  CaptureEntityType,
  CapturePartEntityType,
  ScheduleEntityType,
  SourceEntityType,
  SourceDomainEntityType,
  StoredSettingEntityType,
  DataProviderSerializedType,
  SourceDomainInformationReturnType,
  AllowedScheduleIntervalReturnType,
  BaseDataProviderIconInformationReturnType,
};
