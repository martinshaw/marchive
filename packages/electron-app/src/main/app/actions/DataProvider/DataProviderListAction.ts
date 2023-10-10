/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import BaseDataProvider, { DataProviderSerializedType } from '../../data_providers/BaseDataProvider'
import { getDataProviders } from '../../repositories/DataProviderRepository'

const DataProviderListAction = async (): Promise<DataProviderSerializedType[]> =>
  getDataProviders()
    .then(providers =>
      Promise.all(providers.map(provider => provider.toJSON()))
    )

export default DataProviderListAction
