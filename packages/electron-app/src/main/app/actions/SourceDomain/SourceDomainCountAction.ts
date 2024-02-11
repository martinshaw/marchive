/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainCountAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/

import { runCliCommand } from '../../cli/runCliCommand';

const SourceDomainCountAction = async (): Promise<number> =>
  runCliCommand<{ count: number }>('source-domain:count').then(
    (response) => response.getData()[0]?.count ?? 0,
  );

export default SourceDomainCountAction;