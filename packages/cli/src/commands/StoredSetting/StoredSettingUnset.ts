/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingUnset.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/
import commander from "commander";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";
import { unsetStoredSetting } from "database/src/repositories/StoredSettingRepository";
import {
  StoredSettingKeyType,
  storedSettingKeys,
} from "database/src/entities/StoredSetting";

let StoredSettingUnset = new commander.Command("stored-setting:unset")
  .description("Unset Stored Setting by Key")
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

        const result = await unsetStoredSetting(key);
        if (result === false)
          throw new ErrorResponse(`The Stored Setting was unable to be unset`);

        return new MessageResponse(`Stored Setting unset`).send();
      });
    }
  );

export default StoredSettingUnset;
