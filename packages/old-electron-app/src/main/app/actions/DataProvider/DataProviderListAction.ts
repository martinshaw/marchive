/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { getDataProviders } from 'data-providers';
import { DataProviderSerializedType } from 'data-providers/src/BaseDataProvider';

const DataProviderListAction = async (): Promise<
  DataProviderSerializedType[]
> =>
  getDataProviders().then((providers) =>
    Promise.all(providers.map((provider) => provider.toJSON()))
  );

export default DataProviderListAction;
