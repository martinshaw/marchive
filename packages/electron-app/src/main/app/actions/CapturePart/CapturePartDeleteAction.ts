/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const CapturePartDeleteAction = async (
  capturePartId: number,
  alsoDeleteFiles: boolean = false,
): Promise<void> =>
  runImmediateCliCommandUsingIpcPool<{ id: number }>('capture-part:delete', [
    capturePartId,
    alsoDeleteFiles,
  ]).then((response) => {});

export default CapturePartDeleteAction;
