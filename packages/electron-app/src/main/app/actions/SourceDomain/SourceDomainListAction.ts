/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainListAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/

import { type SourceDomainEntityType } from 'common-types';
import runCliCommandUsingIpcPool from '../../cli/runCliCommandUsingIpcPool';

const SourceDomainListAction = async (
  withSources: boolean,
): Promise<SourceDomainEntityType[]> =>
  runCliCommandUsingIpcPool<SourceDomainEntityType>('source-domain:list', [
    {
      withSources,
    },
  ]).then((response) => response.getData());

export default SourceDomainListAction;
