/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingUnsetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import { runCliCommand } from '../../cli/runCliCommand';
import CliJsonResponse from '../../cli/CliJsonResponse';

/**
 * @throws {Error}
 */
const StoredSettingUnsetAction = async (
  key: string,
): Promise<CliJsonResponse<any[]>> =>
  runCliCommand('stored-setting:unset', [key]);

export default StoredSettingUnsetAction;
