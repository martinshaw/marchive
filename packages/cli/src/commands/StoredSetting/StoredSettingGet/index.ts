/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingGet.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import { StoredSetting } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import { getOrSetStoredSetting } from "database/src/repositories/StoredSettingRepository";
import {
  StoredSettingKeyType,
  storedSettingKeys,
} from "common-types/src/entities/StoredSetting";

let StoredSettingGet = async (key: StoredSettingKeyType) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (!storedSettingKeys.includes(key))
      throw new ErrorResponse(`Invalid key: ${key}`, null, [
        { validKeys: storedSettingKeys },
      ]);

    const storedSetting = await getOrSetStoredSetting(key);
    if (storedSetting == null)
      throw new ErrorResponse(`No setting found for key: ${key}`);

    return new TableResponse<StoredSetting>(`Stored Setting`, [storedSetting], {
      id: "ID",
      key: "Key",
      value: "Value",
      type: "Type",
      createdAt: "Created At",
      updatedAt: "Updated At",
      deletedAt: "Deleted At",
    });
  });
};

export default StoredSettingGet;
