/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: MessageResponse.ts
Created:  2024-02-01T05:16:28.650Z
Modified: 2024-02-01T05:16:28.650Z

Description: description
*/

import BaseResponse from "./BaseResponse";

class MessageResponse extends BaseResponse {
  constructor(message: string, data: any[] = []) {
    super(true, message, data);
  }

  protected guiResponseToConsole(): never {
    console.log(this.getMessage());
    process.exit(0);
  }

  protected jsonResponseToConsole(): never {
    console.log(JSON.stringify(super.toJson()));

    process.exit(0);
  }
}

export default MessageResponse;
