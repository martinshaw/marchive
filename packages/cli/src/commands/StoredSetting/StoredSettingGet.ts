/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingGet.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/
import commander from "commander";
import { Source, StoredSetting } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import { getOrSetStoredSetting } from "database/src/repositories/StoredSettingRepository";
import {
  StoredSettingKeyType,
  storedSettingKeys,
} from "database/src/entities/StoredSetting";

let StoredSettingGet = new commander.Command("stored-setting:get")
  .description("Get Stored Setting by Key")
  .argument(
    "<key>",
    `Key of Stored Setting (valid keys: ${storedSettingKeys.join(" | ")})`
  )
  .action(
    async (
      key: StoredSettingKeyType,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      }
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        if (!storedSettingKeys.includes(key))
          throw new ErrorResponse(`Invalid key: ${key}`, null, [
            { validKeys: storedSettingKeys },
          ]);

        const storedSetting = await getOrSetStoredSetting(key);
        if (storedSetting == null)
          throw new ErrorResponse(`No setting found for key: ${key}`);

        return new TableResponse<StoredSetting>(
          `Stored Setting`,
          [storedSetting],
          {
            id: "ID",
            key: "Key",
            value: "Value",
            type: "Type",
            createdAt: "Created At",
            updatedAt: "Updated At",
            deletedAt: "Deleted At",
          }
        ).send();
      });
    }
  );

export default StoredSettingGet;
