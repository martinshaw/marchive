/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureDelete.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import commander from "commander";
import action from ".";

const CaptureDelete = new commander.Command("capture:delete");

CaptureDelete.description("Delete a Capture")
  .argument("<capture-id>", "Capture ID")
  .option(`--also-delete-files`, "Also delete files associated with Capture")
  .action(
    async (
      captureId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(captureId, optionsAndArguments?.alsoDeleteFiles as boolean).then(
        (action) => action.respondToConsole(),
      ),
  );

export default CaptureDelete;
