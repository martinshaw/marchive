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
    protected success: boolean,
    protected message: string,
    protected data: TDataType,
  ) {}

  public getSuccess(): typeof this.success {
    return this.success;
  }

  public getMessage(): typeof this.message {
    return this.message;
  }

  public getData(): typeof this.data {
    return this.data;
  }

  public toJson(): {
    success: boolean;
    message: string;
    data: TDataType;
  } {
    return {
      success: this.getSuccess(),
      message: this.getMessage(),
      data: this.getData(),
    };
  }

  protected abstract guiResponseToConsole(): never;
  protected abstract jsonResponseToConsole(): never;

  public respondToConsole(): never {
    return process.argv.includes("--json") || process.argv.includes("-j")
      ? this.jsonResponseToConsole()
      : this.guiResponseToConsole();
  }
}

export default BaseResponse;
