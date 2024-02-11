/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const SourceDeleteAction = async (
  sourceId: number,
  alsoDeleteFiles: boolean = false,
): Promise<void> =>
  runCliCommand<{ id: number }>('source:delete', [sourceId], {
    alsoDeleteFiles,
  }).then((response) => {});

export default SourceDeleteAction;
