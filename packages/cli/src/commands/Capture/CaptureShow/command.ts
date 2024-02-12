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

let CaptureShow = new commander.Command("capture:show");

CaptureShow = addTypeormRelationsCommanderOptions(CaptureShow);

CaptureShow.description("Get singular Capture by ID")
  .argument("<capture-id>", "Capture ID")
  .action(
    async (
      captureId: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) =>
      action(captureId, optionsAndArguments).then((action) =>
        action.respondToConsole(),
      ),
  );

export default CaptureShow;
