/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:09:59.311Z
Modified: 2024-02-12T06:09:59.311Z

Description: description
*/

import commander from "commander";
import action, { addFileTypeFilteringCommanderOption } from ".";

let CapturePartShowFiles = new commander.Command("capture-part:show-files");

CapturePartShowFiles =
  addFileTypeFilteringCommanderOption(CapturePartShowFiles);

CapturePartShowFiles.description("Get singular Capture Part's Files")
  .argument("<capture-part-id>", "Capture Part ID")
  .action(
    async (
      capturePartId: number,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(capturePartId, optionsAndArguments).then((action) =>
        action.respondToConsole(),
      ),
  );

export default CapturePartShowFiles;
