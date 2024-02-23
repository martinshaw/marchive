/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilityAddCliToPathAction.ts
Created:  2024-02-22T22:23:45.710Z
Modified: 2024-02-22T22:23:45.710Z

Description: description
*/

import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const UtilityAddCliToPathAction = async (): Promise<void> =>
  runImmediateCliCommandUsingIpcPool<void>(
    'utilities:add-cli-to-path',
    [],
  ).then((response) => {});

export default UtilityAddCliToPathAction;
