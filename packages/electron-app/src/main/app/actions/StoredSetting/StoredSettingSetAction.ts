/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingSetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const StoredSettingSetAction = async (
  key: string,
  value: string,
): Promise<CliJsonResponse<any[]>> =>
  runCliCommand('stored-setting:set', [key, value]);

export default StoredSettingSetAction;
