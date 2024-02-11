/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type CaptureEntityType } from 'common-types';
import { runCliCommand } from '../../cli/runCliCommand';

const CaptureShowAction = async (
  captureId: number,
  withSchedule: boolean = false,
  withSource: boolean = false,
  withSourceDomain: boolean = false,
  withCaptureParts: boolean = false,
): Promise<CaptureEntityType> =>
  runCliCommand<CaptureEntityType>('capture:show', [captureId], {
    withSchedule,
    withSource,
    withSourceDomain,
    withCaptureParts,
  }).then((response) => response.getData()[0]);

export default CaptureShowAction;
