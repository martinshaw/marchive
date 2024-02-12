/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingSet.ts
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

let StoredSettingSet = async (
  key: StoredSettingKeyType,
  value: string | number | boolean,
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (!storedSettingKeys.includes(key))
      throw new ErrorResponse(`Invalid key: ${key}`, null, [
        { validKeys: storedSettingKeys },
      ]);

    let valueAsString: string = value.toString();
    if (typeof valueAsString === "boolean")
      valueAsString = valueAsString ? "true" : "false";

    const storedSetting = await getOrSetStoredSetting(key, valueAsString);
    if (storedSetting == null)
      throw new ErrorResponse(
        `An error occurred while setting the setting with the key: ${key}`,
      );

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

export default StoredSettingSet;
