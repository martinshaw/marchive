/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DataProviderShow.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/
import commander from "commander";
import ErrorResponse from "../../responses/ErrorResponse";
import TableResponse from "../../responses/TableResponse";
import { getDataProviderByIdentifier } from "data-providers";
import { DataProviderSerializedType } from "data-providers/src/BaseDataProvider";

let DataProviderShow = new commander.Command("data-provider:show")
  .argument("<data-provider-identifier>", "Data Provider Identifier")
  .description("Get singular Data Providers by Identifier")
  .action(
    async (
      dataProviderIdentifier: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
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
        ).send();
      });
    },
  );

export default DataProviderShow;
