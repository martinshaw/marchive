/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderValidate.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import { validateUrlWithDataProviders } from "data-providers";
import { DataProviderSerializedType } from "common-types";

let DataProviderValidate = async (url: string) => {
  ErrorResponse.catchErrorsWithErrorResponse(async () => {
    // Reduce unnecessary checks by ignoring URLs shorter than 4 characters (e.g. a.co)
    if (url.length < 4) {
      return new ErrorResponse("URL must be at least 4 characters long").send();
    }

    const urlRegex = /^(http|https|ftp|file):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) url = `https://${url}`;

    const validDataProviders = await validateUrlWithDataProviders(url)
      .then((validDataProvidersForUrl) =>
        Promise.all(
          validDataProvidersForUrl.map((dataProvider) => dataProvider.toJSON()),
        ),
      )
      .then((dataProviders) => dataProviders.reverse());

    return new TableResponse<DataProviderSerializedType>(
      `Data Provider`,
      validDataProviders,
      {
        identifier: "Identifier",
        name: "Name",
        description: "Description",
        iconInformation: "Icon Information",
      },
    ).send();
  });
};

export default DataProviderValidate;
