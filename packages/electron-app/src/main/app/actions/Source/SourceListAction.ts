/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type SourceEntityType } from 'common-types';
import { runCliCommand } from '../../cli/runCliCommand';

const SourceListAction = async (): Promise<SourceEntityType[]> =>
  runCliCommand<SourceEntityType>('source:list', [], {
    withSchedules: true,
    withSourceDomain: false,
  }).then((response) => response.getData());

export default SourceListAction;
