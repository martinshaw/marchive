/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type CaptureEntityType } from 'common-types';
import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

const CaptureListAction = async (): Promise<CaptureEntityType[]> =>
  runImmediateCliCommandUsingIpcPool<CaptureEntityType>('capture:list').then(
    (response) => response.getData(),
  );

export default CaptureListAction;
