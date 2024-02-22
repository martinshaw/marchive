/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type SourceEntityType } from 'common-types';
import runCliCommandUsingIpcPool from '../../cli/runCliCommandUsingIpcPool';

const SourceShowAction = async (
  sourceId: number,
  withSourceDomain: boolean = false,
  withSchedules: boolean = false,
): Promise<SourceEntityType> =>
  runCliCommandUsingIpcPool<SourceEntityType>('source:show', [
    sourceId,
    {
      withSourceDomain,
      withSchedules,
    },
  ]).then((response) => response.getData()[0]);

export default SourceShowAction;
