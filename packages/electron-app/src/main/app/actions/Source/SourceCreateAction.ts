/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type SourceEntityType } from 'common-types';
import runCliCommand from '../../cli/runCliCommand';

const SourceCreateAction = async (
  url: string,
  dataProviderIdentifier: string,
): Promise<SourceEntityType> =>
  runCliCommand<SourceEntityType>('source:create', [
    url,
    dataProviderIdentifier,
  ]).then((response) => response.getData()[0]);

export default SourceCreateAction;
