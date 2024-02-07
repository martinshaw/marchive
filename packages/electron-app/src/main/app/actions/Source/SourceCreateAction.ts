/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommandWithImmediateResponse } from '../../cli/runCliCommand';

const SourceCreateAction = async (
  url: string,
  dataProviderIdentifier: string,
): Promise<CliJsonResponse<[any]>> =>
  runCliCommandWithImmediateResponse('source:create', [
    url,
    dataProviderIdentifier,
  ]);

export default SourceCreateAction;
