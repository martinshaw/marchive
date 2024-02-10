/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainShowAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/

import { runCliCommand } from '../../cli/runCliCommand';

const SourceDomainShowAction = async (
  sourceDomainId: number,
  withSources: boolean,
): Promise<any> =>
  runCliCommand<any[]>('source-domain:show', [sourceDomainId], {
    withSources,
  }).then((response) => response.getData()[0]);

export default SourceDomainShowAction;
