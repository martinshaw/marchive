/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: logToConsoleGlobalOption.ts
Created:  2024-02-02T00:07:08.787Z
Modified: 2024-02-02T00:07:08.788Z

Description: description
*/

import { Option } from "commander";

const logToConsoleGlobalOption = new Option(
  "-l, --log-to-console",
  "Print all logs to console (in addition to file)"
)
  .env("MARCHIVE_CLI_LOG_TO_CONSOLE")
  .default(false)
  .conflicts(["j", "json"]);

export default logToConsoleGlobalOption;
