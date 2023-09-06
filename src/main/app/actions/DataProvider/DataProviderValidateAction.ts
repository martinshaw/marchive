/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderValidateAction.ts
Created:  2023-08-31T03:18:06.255Z
Modified: 2023-08-31T03:18:06.255Z

Description: description
*/

import { DataProviderSerializedType } from "../../data_providers/BaseDataProvider";
import { validateUrlWithDataProviders } from "../../repositories/DataProviderRepository";

/**
 * @throws {Error}
 */
const DataProviderValidateAction = async (url: string): Promise<DataProviderSerializedType[]> =>
  validateUrlWithDataProviders(url)
    .then(validDataProvidersForUrl =>
      Promise.all(
        validDataProvidersForUrl.map(
          (dataProvider) => dataProvider.toJSON()
        )
      )
    )
    .then(dataProviders => dataProviders.reverse())

export default DataProviderValidateAction
