/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:22:20.337Z
Modified: 2024-02-12T06:22:20.337Z

Description: description
*/

import commander from "commander";
import action from ".";

const ScheduleCreate = new commander.Command("schedule:create");

ScheduleCreate.description("Create a new Schedule")
  .argument("<source-id>", "Source ID")
  .option(
    `--interval-in-seconds <interval-in-seconds>`,
    "Interval in Seconds (default: does not repeat) (e.g. one hour = 3600, one day = 86400, two days = 172800, one week = 604800, two weeks = 1209600, monthly = 2592000, two months = 5184000, yearly = 31536000, monthly = 2592000)",
  )
  .option(
    `--download-location <download-location>`,
    "Download location (default: same as Source's download location)",
  )
  .action(
    async (
      sourceId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(
        sourceId,
        optionsAndArguments?.intervalInSeconds as number | null,
        optionsAndArguments?.downloadLocation as string | null,
      ),
  );

export default ScheduleCreate;
