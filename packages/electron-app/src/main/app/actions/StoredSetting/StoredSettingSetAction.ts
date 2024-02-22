/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingSetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import { type StoredSettingEntityType } from 'common-types';
import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const StoredSettingSetAction = async (
  key: string,
  value: string,
): Promise<StoredSettingEntityType> =>
  runImmediateCliCommandUsingIpcPool<StoredSettingEntityType>(
    'stored-setting:set',
    [key, value],
  ).then((response) => response.getData()[0]);

export default StoredSettingSetAction;
