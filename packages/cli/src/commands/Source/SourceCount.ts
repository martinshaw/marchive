/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCount.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import commander from "commander";
import { Source } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";

const SourceCount = new commander.Command("source:count");

SourceCount.description("Get the count of Sources").action(async (program) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const count = await Source.count();

    return new MessageResponse(`${count} Source${count === 1 ? "" : "s"}`, [
      {
        count,
      },
    ]).send();
  });
});

export default SourceCount;
