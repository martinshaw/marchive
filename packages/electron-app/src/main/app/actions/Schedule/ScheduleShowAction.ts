/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type ScheduleEntityType } from 'common-types';
import runCliCommandUsingIpcPool from '../../cli/runCliCommandUsingIpcPool';

const ScheduleShowAction = async (
  scheduleId: number,
  withSource = false,
  withCaptures = false,
): Promise<ScheduleEntityType> =>
  runCliCommandUsingIpcPool<ScheduleEntityType>('schedule:show', [
    scheduleId,
    {
      withSource,
      withCaptures,
    },
  ]).then((response) => response.getData()[0]);

export default ScheduleShowAction;
