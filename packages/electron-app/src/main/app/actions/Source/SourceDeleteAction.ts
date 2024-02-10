/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const SourceDeleteAction = async (
  sourceId: number,
  alsoDeleteFiles: boolean = false,
): Promise<CliJsonResponse<any[]>> =>
  runCliCommand('source:delete', [sourceId], {
    alsoDeleteFiles,
  });

export default SourceDeleteAction;
