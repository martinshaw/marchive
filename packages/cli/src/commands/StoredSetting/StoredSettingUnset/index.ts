/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingUnset.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";
import { unsetStoredSetting } from "database/src/repositories/StoredSettingRepository";
import {
  storedSettingKeys,
  StoredSettingKeyType,
} from "common-types/src/entities/StoredSetting";

let StoredSettingUnset = async (key: StoredSettingKeyType) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    if (!storedSettingKeys.includes(key))
      return new ErrorResponse(`Invalid key: ${key}`, null, [
        { validKeys: storedSettingKeys },
      ]);

    const result = await unsetStoredSetting(key);
    if (result === false)
      return new ErrorResponse(`The Stored Setting was unable to be unset`);

    return new MessageResponse(`Stored Setting unset`);
  });
};

export default StoredSettingUnset;
