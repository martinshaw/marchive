/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type ScheduleEntityType } from 'common-types';
import runCliCommand from '../../cli/runCliCommand';

const ScheduleListAction = async (
  sourceId: number | null = null,
  withSource = false,
  withCaptures = false,
): Promise<ScheduleEntityType[]> =>
  runCliCommand<ScheduleEntityType>('schedule:list', [], {
    ...(sourceId !== null && { whereSourceIdEq: sourceId }),
    withSource,
    withCaptures,
  }).then((response) => response.getData());

export default ScheduleListAction;
