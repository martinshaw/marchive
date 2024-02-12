/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:37:52.358Z
Modified: 2024-02-12T08:37:52.358Z

Description: description
*/

import commander from "commander";
import action from ".";
import {
  StoredSettingKeyType,
  storedSettingKeys,
} from "common-types/src/entities/StoredSetting";

let StoredSettingGet = new commander.Command("stored-setting:get")
  .description("Get Stored Setting by Key")
  .argument(
    "<key>",
    `Key of Stored Setting (valid keys: ${storedSettingKeys.join(" | ")})`,
  )
  .action(async (key: StoredSettingKeyType) => action(key));

export default StoredSettingGet;
