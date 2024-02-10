/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainListAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommand } from '../../cli/runCliCommand';

const SourceDomainListAction = async (withSources: boolean): Promise<any[]> =>
  runCliCommand<any[]>('source-domain:list', [], {
    withSources,
  }).then((response) => response.getData());

export default SourceDomainListAction;
