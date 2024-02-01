/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BaseResponse.ts
Created:  2024-02-01T05:13:54.485Z
Modified: 2024-02-01T05:13:54.485Z

Description: description
*/

import process from "node:process";

abstract class BaseResponse {
  constructor(
    protected isSuccess: boolean,
    protected message: string,
    protected data: any[]
  ) {}

  public getIsSuccess(): boolean {
    return this.isSuccess;
  }

  public getMessage(): string {
    return this.message;
  }

  public getData(): any[] {
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
