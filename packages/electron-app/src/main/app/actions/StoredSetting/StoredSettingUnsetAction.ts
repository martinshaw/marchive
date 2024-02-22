/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingUnsetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const StoredSettingUnsetAction = async (key: string): Promise<void> =>
  runImmediateCliCommandUsingIpcPool<[]>('stored-setting:unset', [key]).then(
    (response) => {},
  );

export default StoredSettingUnsetAction;
