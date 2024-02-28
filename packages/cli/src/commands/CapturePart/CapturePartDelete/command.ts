/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartDelete.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import commander from "commander";
import action from ".";

const CapturePartDelete = new commander.Command("capture-part:delete");

CapturePartDelete.description("Delete a Capture Part")
  .argument("<capture-part-id>", "Capture Part ID")
  .option(
    `--also-delete-files`,
    "Also delete files associated with Capture Part",
  )
  .action(
    async (
      capturePartId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
    ) =>
      action(
        capturePartId,
        optionsAndArguments?.alsoDeleteFiles as boolean,
      ).then((action) => action.respondToConsole()),
  );

export default CapturePartDelete;
