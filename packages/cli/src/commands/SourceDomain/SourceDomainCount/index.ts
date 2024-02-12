/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainCount.ts
Created:  2024-02-02T12:17:35.999Z
Modified: 2024-02-02T12:17:35.999Z

Description: description
*/

import { SourceDomain } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";

const SourceDomainCount = async () => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const count = await SourceDomain.count();

    return new MessageResponse(
      `${count} Source Domain${count === 1 ? "" : "s"}`,
      [
        {
          count,
        },
      ],
    ).send();
  });
};

export default SourceDomainCount;
