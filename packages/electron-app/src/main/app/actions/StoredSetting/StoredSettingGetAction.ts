/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingGetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const StoredSettingGetAction = async (
  key: string,
): Promise<CliJsonResponse<any[]>> =>
  runCliCommand('stored-setting:get', [key]);

export default StoredSettingGetAction;
