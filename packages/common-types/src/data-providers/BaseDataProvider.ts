/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BaseDataProvider.ts
Created:  2024-02-11T05:49:51.435Z
Modified: 2024-02-11T05:49:51.435Z

Description: description
*/

type DataProviderSerializedType = {
  identifier: string;
  name: string;
  description: string;
  iconInformation: BaseDataProviderIconInformationReturnType;
};

type SourceDomainInformationReturnType = {
  siteName: string | null;
  // TODO: Add site favicon using more time-effective method in future, see commented code in SourceDomainRepository.ts
};

type AllowedScheduleIntervalReturnType = {
  onlyRunOnce?: boolean;
};

type BaseDataProviderIconInformationReturnType = {
  filePath: string;
  shouldInvertOnDarkMode: boolean;
};

export {
  DataProviderSerializedType,
  SourceDomainInformationReturnType,
  AllowedScheduleIntervalReturnType,
  BaseDataProviderIconInformationReturnType,
};
