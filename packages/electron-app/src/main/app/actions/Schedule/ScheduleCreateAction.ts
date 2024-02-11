/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleCreateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type ScheduleEntityType } from 'common-types';
import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const ScheduleCreateAction = async (
  sourceId: number,
  intervalInSeconds: number | null,
  downloadLocation: string | null = null,
): Promise<ScheduleEntityType> =>
  runCliCommand<ScheduleEntityType>('schedule:create', [sourceId], {
    intervalInSeconds,
    downloadLocation,
  }).then((response) => response.getData()[0]);

export default ScheduleCreateAction;
