/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderValidateAction.ts
Created:  2023-08-31T03:18:06.255Z
Modified: 2023-08-31T03:18:06.255Z

Description: description
*/

import { type DataProviderSerializedType } from 'common-types';
import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

/**
 * @throws {Error}
 */
const DataProviderValidateAction = async (
  url: string,
): Promise<DataProviderSerializedType[]> =>
  runImmediateCliCommandUsingIpcPool<DataProviderSerializedType>(
    'data-provider:validate',
    [url],
  ).then((result) => result.getData());

export default DataProviderValidateAction;
