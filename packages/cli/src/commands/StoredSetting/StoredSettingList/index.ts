/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { StoredSetting } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateTypeormWhereObjectFromCommanderOptions from "../../../options/generateTypeormWhereObjectFromCommanderOptions";

export const [
  addTypeormWhereCommanderOptions,
  determineTypeormWhereObjectFromCommanderOptions,
] = generateTypeormWhereObjectFromCommanderOptions<StoredSetting>({
  id: { type: "integer" },
  key: { type: "string" },
  value: { type: "string" },
  type: { type: "string", nullable: true },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  deletedAt: { type: "date", nullable: true },
});

let StoredSettingList = async (optionsAndArguments: {
  [key: string]: string | number | boolean;
}) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const storedSettings = await StoredSetting.find({
      where:
        determineTypeormWhereObjectFromCommanderOptions(optionsAndArguments),
    });

    return new TableResponse<StoredSetting>("Stored Setting", storedSettings, {
      id: "ID",
      key: "Key",
      value: "Value",
      type: "Type",
      createdAt: "Created At",
      updatedAt: "Updated At",
      deletedAt: "Deleted At",
    }).send();
  });
};

export default StoredSettingList;
