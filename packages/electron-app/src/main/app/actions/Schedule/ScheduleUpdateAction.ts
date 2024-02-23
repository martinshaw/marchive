/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleUpdateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type ScheduleEntityType } from 'common-types';
import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const ScheduleUpdateAction = async (
  scheduleId: number,
  // TODO : Need to change this, I suspect that using null and not undefined will cause the interval to be updated to null instead of not being updated as desired
  intervalInSeconds: number | null = null,
  downloadLocation: string | null = null,
  enable: boolean | null = null,
  disable: boolean | null = null,
): Promise<ScheduleEntityType> =>
  runImmediateCliCommandUsingIpcPool<ScheduleEntityType>('schedule:update', [
    scheduleId,
    {
      intervalInSeconds,
      downloadLocation,
      enable,
      disable,
    },
  ]).then((response) => response.getData()[0]);

export default ScheduleUpdateAction;
