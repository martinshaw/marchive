/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ErrorResponse.ts
Created:  2024-02-01T05:22:54.868Z
Modified: 2024-02-01T05:22:54.868Z

Description: description
*/

import logger from "logger";
import BaseResponse from "./BaseResponse";

class ErrorResponse extends BaseResponse {
  constructor(
    message: string,
    protected error: Error | null = null,
    data: any[] = [],
  ) {
    super(false, message, data);
  }

  public respondToConsole(): never {
    /**
     * Don't need to log the error in the command's code file. When an ErrorResponse or error is thrown,
     * the catchErrorsWithErrorResponse() method will log the error before printing the
     * error message to the console and exiting the process.
     */
    logger.error(this.getMessage());
    // TODO: Something to do with winston config is causing Winston not to be logging errors at all
    if (this.error != null) logger.error(this.error);

    return super.respondToConsole();
  }

  protected guiResponseToConsole(): never {
    console.log(this.getMessage());
    process.exit(1);
  }

  protected jsonResponseToConsole(): never {
    console.log(
      JSON.stringify({
        ...super.toJson(),
        detailedMessage: this.error?.message ?? null,
      }),
    );

    process.exit(1);
  }

  public static async catchErrorsWithErrorResponse(
    callback: () => BaseResponse | Promise<BaseResponse>,
  ) {
    return this.catchErrorsWithErrorResponseAllowingPerpetualCommand(
      callback,
    ) as BaseResponse | Promise<BaseResponse>;
  }

  public static async catchErrorsWithErrorResponseAllowingPerpetualCommand(
    callback: () => BaseResponse | Promise<BaseResponse> | void | Promise<void>,
  ) {
    try {
      return await callback();
    } catch (error) {
      /**
       * Typically, we can "early return" a command on an error, by simply throwing an ErrorResponse with a
       * user-friendly message and the original error (optionally)
       */
      if (error instanceof ErrorResponse || error instanceof BaseResponse) {
        return error;
      }

      /**
       * If we get here, we have an unexpected error (e.g. a DB error, shell exec error, etc.), so we
       * catch it and return a generic error message
       */
      return new ErrorResponse(
        typeof error === "string"
          ? error
          : "Unfortunately, an error happened. Please try again.",
        error instanceof Error ? error : null,
        [
          {
            detailedMessage: error instanceof Error ? error.message : null,
          },
        ],
      );
    }
  }
}

export default ErrorResponse;
