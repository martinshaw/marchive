/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type CapturePartEntityType } from 'common-types';
import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

const CapturePartListAction = async (): Promise<CapturePartEntityType[]> =>
  runImmediateCliCommandUsingIpcPool<CapturePartEntityType>(
    'capture-part:list',
  ).then((response) => response.getData());

export default CapturePartListAction;
