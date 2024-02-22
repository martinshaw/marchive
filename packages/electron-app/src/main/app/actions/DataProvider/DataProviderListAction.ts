/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { type DataProviderSerializedType } from 'common-types';
import runCliCommandUsingIpcPool from '../../cli/runCliCommandUsingIpcPool';

const DataProviderListAction = async (): Promise<
  DataProviderSerializedType[]
> =>
  runCliCommandUsingIpcPool<DataProviderSerializedType>(
    'data-provider:list',
  ).then((result) => result.getData());

export default DataProviderListAction;
