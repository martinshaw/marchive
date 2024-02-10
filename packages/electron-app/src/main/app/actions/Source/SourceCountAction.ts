/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCountAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommand } from '../../cli/runCliCommand';

const SourceCountAction = async (): Promise<
  CliJsonResponse<[{ count: number }]>
> => runCliCommand('source:count');

export default SourceCountAction;
