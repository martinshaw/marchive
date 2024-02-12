/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:58:56.822Z
Modified: 2024-02-12T06:58:56.822Z

Description: description
*/

import commander, { Command, Option } from "commander";
import action from ".";

const ScheduleUpdate = new commander.Command("schedule:update");

ScheduleUpdate.description("Update an existing Schedule")
  .argument("<schedule-id>", "Schedule ID")
  .option(
    `--interval-in-seconds <interval-in-seconds>`,
    "Update Schedule's Interval in Seconds (e.g. one hour = 3600, one day = 86400, two days = 172800, one week = 604800, two weeks = 1209600, monthly = 2592000, two months = 5184000, yearly = 31536000, monthly = 2592000)",
  )
  .option(
    `--download-location <download-location>`,
    "Update Schedule's Download location",
  )
  .addOption(new Option(`--enable`, "Enable Schedule").conflicts("disable"))
  .addOption(new Option(`--disable`, "Disable Schedule").conflicts("enable"))
  .action(
    async (
      scheduleId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(
        scheduleId,
        optionsAndArguments?.intervalInSeconds as number | null | undefined,
        optionsAndArguments?.downloadLocation as string | null | undefined,
        optionsAndArguments?.enable as boolean | null | undefined,
        optionsAndArguments?.disable as boolean | null | undefined,
      ).then((action) => action.respondToConsole()),
  );

export default ScheduleUpdate;
