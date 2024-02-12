/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:43:44.554Z
Modified: 2024-02-12T08:43:44.554Z

Description: description
*/

import commander from "commander";
import action from ".";
import {
  storedSettingKeys,
  StoredSettingKeyType,
} from "common-types/src/entities/StoredSetting";

let StoredSettingUnset = new commander.Command("stored-setting:unset")
  .description("Unset Stored Setting by Key")
  .argument(
    "<key>",
    `Key of Stored Setting (valid keys: ${storedSettingKeys.join(" | ")})`,
  )
  .action(async (key: StoredSettingKeyType) => action(key));

export default StoredSettingUnset;
