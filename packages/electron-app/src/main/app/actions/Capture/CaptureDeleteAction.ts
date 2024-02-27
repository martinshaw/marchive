/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const CaptureDeleteAction = async (
  captureId: number,
  alsoDeleteFiles: boolean = false,
): Promise<void> =>
  runImmediateCliCommandUsingIpcPool<{ id: number }>('capture:delete', [
    captureId,
    alsoDeleteFiles,
  ]).then((response) => {});

export default CaptureDeleteAction;
