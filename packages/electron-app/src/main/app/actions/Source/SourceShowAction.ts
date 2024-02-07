/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommandWithImmediateResponse } from '../../cli/runCliCommand';

const SourceShowAction = async (
  sourceId: number,
  withSourceDomain: boolean = false,
  withSchedules: boolean = false,
): Promise<CliJsonResponse<any[]>> => {
  return runCliCommandWithImmediateResponse('source:show', [sourceId], {
    withSourceDomain,
    withSchedules,
  });
};

export default SourceShowAction;
