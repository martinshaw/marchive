/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderValidateAction.ts
Created:  2023-08-31T03:18:06.255Z
Modified: 2023-08-31T03:18:06.255Z

Description: description
*/

// import { validateUrlWithDataProviders } from 'data-providers';
// import { DataProviderSerializedType } from 'data-providers/src/BaseDataProvider';

/**
 * @throws {Error}
 */
// const DataProviderValidateAction = async (
//   url: string
// ): Promise<DataProviderSerializedType[]> =>
//   validateUrlWithDataProviders(url)
//     .then((validDataProvidersForUrl) =>
//       Promise.all(
//         validDataProvidersForUrl.map((dataProvider) => dataProvider.toJSON())
//       )
//     )
//     .then((dataProviders) => dataProviders.reverse());

const DataProviderValidateAction = async (url: string): Promise<[]> => [];

export default DataProviderValidateAction;
