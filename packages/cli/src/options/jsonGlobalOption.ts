/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: jsonGlobalOption.ts
Created:  2024-02-02T00:07:50.691Z
Modified: 2024-02-02T00:07:50.692Z

Description: description
*/

import { Option } from "commander";

const jsonGlobalOption = new Option("-j, --json", "Format all output as JSON")
  .default(false)
  .conflicts(["l", "log-to-console"]);

export default jsonGlobalOption;
