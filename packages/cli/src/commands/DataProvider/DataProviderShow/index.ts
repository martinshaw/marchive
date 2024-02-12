/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import { getDataProviderByIdentifier } from "data-providers";
import { DataProviderSerializedType } from "common-types";

let DataProviderShow = async (dataProviderIdentifier: string) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const dataProvider = await getDataProviderByIdentifier(
      dataProviderIdentifier,
    );

    if (dataProvider == null) {
      throw new ErrorResponse("Data Provider not found");
    }

    return new TableResponse<DataProviderSerializedType>(
      `Data Provider`,
      [await dataProvider.toJSON()],
      {
        identifier: "Identifier",
        name: "Name",
        description: "Description",
      },
    );
  });
};

export default DataProviderShow;
