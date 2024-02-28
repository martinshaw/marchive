/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T06:14:28.221Z
Modified: 2024-02-12T06:14:28.221Z

Description: description
*/

import commander from "commander";
import action, { addTypeormRelationsCommanderOptions } from ".";

let CapturePartShow = new commander.Command("capture-part:show");

CapturePartShow = addTypeormRelationsCommanderOptions(CapturePartShow);

CapturePartShow.description("Get singular Capture Part by ID")
  .argument("<capture-part-id>", "Capture Part ID")
  .action(
    async (
      capturePartId: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) =>
      action(capturePartId, optionsAndArguments).then((action) =>
        action.respondToConsole(),
      ),
  );

export default CapturePartShow;
