/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartShowAction.ts
Created:  2024-02-28T02:05:01.636Z
Modified: 2024-02-28T02:05:01.636Z

Description: description
*/
import { type CapturePartEntityType } from 'common-types';
import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

const CapturePartShowAction = async (
  capturePartId: number,
  withCapture: boolean = false,
): Promise<CapturePartEntityType> =>
  runImmediateCliCommandUsingIpcPool<CapturePartEntityType>(
    'capture-part:show',
    [
      capturePartId,
      {
        withCapture,
      },
    ],
  ).then((response) => response.getData()[0]);

export default CapturePartShowAction;
