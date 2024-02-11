/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CliJsonResponse.ts
Created:  2024-02-07T04:21:28.578Z
Modified: 2024-02-07T04:21:28.578Z

Description: description
*/

class CliJsonResponse<TDataType extends any> {
  protected success!: boolean;
  protected message!: string;
  protected data: TDataType[] = [];

  constructor(public readonly response: string) {
    try {
      const responseObject = JSON.parse(response);

      if (typeof responseObject !== 'object') {
        throw new Error('The response is not a valid JSON object.');
      }

      if (typeof responseObject.success !== 'boolean') {
        throw new Error(
          'The response does not contain a valid `success` property.',
        );
      }

      if (typeof responseObject.message !== 'string') {
        throw new Error(
          'The response does not contain a valid `message` property.',
        );
      }

      if (!Array.isArray(responseObject.data)) {
        throw new Error(
          'The response does not contain a valid `data` property.',
        );
      }

      this.success = responseObject.success;
      this.message = responseObject.message;
      this.data = responseObject.data;
    } catch (error) {
      this.success = false;
      this.message =
        error instanceof Error
          ? 'An error occurred while parsing the response: ' + error.message
          : 'An error occurred while parsing the response.';
      this.data = [];
    }
  }

  public getSuccess(): typeof this.success {
    return this.success;
  }

  public getMessage(): typeof this.message {
    return this.message;
  }

  public getData(): typeof this.data {
    return this.data;
  }

  public toError(): Error {
    return new Error(this.message);
  }
}

export default CliJsonResponse;
