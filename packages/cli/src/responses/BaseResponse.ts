/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BaseResponse.ts
Created:  2024-02-01T05:13:54.485Z
Modified: 2024-02-01T05:13:54.485Z

Description: description
*/

import process from "node:process";

abstract class BaseResponse<TDataType extends any[] = any[]> {
  constructor(
    protected isSuccess: boolean,
    protected message: string,
    protected data: TDataType
  ) {}

  public getIsSuccess(): typeof this.isSuccess {
    return this.isSuccess;
  }

  public getMessage(): typeof this.message {
    return this.message;
  }

  public getData(): typeof this.data {
    return this.data;
  }

  protected abstract guiResponse(): never;
  protected abstract jsonResponse(): never;

  public send(): never {
    return process.argv.includes("--json") || process.argv.includes("-j")
      ? this.jsonResponse()
      : this.guiResponse();
  }
}

export default BaseResponse;
