/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:42:30.296Z
Modified: 2024-02-12T08:42:30.297Z

Description: description
*/

import commander from "commander";
import action from ".";
import {
  StoredSettingKeyType,
  storedSettingKeys,
} from "common-types/src/entities/StoredSetting";

let StoredSettingSet = new commander.Command("stored-setting:set")
  .description("Set Stored Setting by Key")
  .argument(
    "<key>",
    `Key of Stored Setting (valid keys: ${storedSettingKeys.join(" | ")})`,
  )
  .argument("<value>", `New Value of Stored Setting`)
  .action(async (key: StoredSettingKeyType, value: string | number | boolean) =>
    action(key, value).then((action) => action.respondToConsole()),
  );

export default StoredSettingSet;
