/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderList.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/
import commander from "commander";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import { getDataProviders } from "data-providers";
import { DataProviderSerializedType } from "data-providers/src/BaseDataProvider";

let DataProviderList = new commander.Command("data-provider:list")
  .description("Get Data Providers")
  .action(
    async (optionsAndArguments: {
      [key: string]: string | number | boolean;
    }) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        const dataProviders = await getDataProviders().then(
          (validDataProvidersForUrl) =>
            Promise.all(
              validDataProvidersForUrl.map((dataProvider) =>
                dataProvider.toJSON()
              )
            )
        );

        return new TableResponse<DataProviderSerializedType>(
          `Data Provider`,
          dataProviders,
          {
            identifier: "Identifier",
            name: "Name",
            description: "Description",
            iconInformation: "Icon Information",
          }
        ).send();
      });
    }
  );

export default DataProviderList;
