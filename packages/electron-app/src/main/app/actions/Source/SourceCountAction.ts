/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCountAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import runCliCommand from '../../cli/runCliCommand';

const SourceCountAction = async (): Promise<number> =>
  runCliCommand<{ count: number }>('source:count').then(
    (response) => response.getData()[0]?.count ?? 0,
  );

export default SourceCountAction;
