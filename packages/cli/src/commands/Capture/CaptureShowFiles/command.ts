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

let CaptureShowFiles = new commander.Command("capture:show-files");

CaptureShowFiles = addFileTypeFilteringCommanderOption(CaptureShowFiles);

CaptureShowFiles.description("Get singular Capture's Files")
  .argument("<capture-id>", "Capture ID")
  .action(
    async (
      captureId: number,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(captureId, optionsAndArguments).then((action) =>
        action.respondToConsole(),
      ),
  );

export default CaptureShowFiles;
