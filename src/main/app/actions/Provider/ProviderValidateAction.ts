/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ProviderValidateAction.ts
Created:  2023-08-31T03:18:06.255Z
Modified: 2023-08-31T03:18:06.255Z

Description: description
*/

import { DataProviderSerializedType } from "../../../app/providers/BaseDataProvider";
import { validateUrlWithDataProviders } from "../../../app/repositories/DataProviderRepository";

/**
 * @throws {Error}
 */
const ProviderValidateAction = async (url: string): Promise<DataProviderSerializedType[]> => {
  return validateUrlWithDataProviders(url)
    .then(validDataProvidersForUrl =>
      validDataProvidersForUrl.map(
        dataProvider => dataProvider.toJSON()
      )
    )
}

export default ProviderValidateAction
