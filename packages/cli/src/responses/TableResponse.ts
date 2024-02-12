/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: MessageResponse.ts
Created:  2024-02-01T05:16:28.650Z
Modified: 2024-02-01T05:16:28.650Z

Description: description
*/

import { table } from "table";
import { BaseEntity } from "database";
import BaseResponse from "./BaseResponse";
import { JSONValue } from "types-json";

class TableResponse<
  TEntityType extends BaseEntity | { [key: string]: JSONValue },
> extends BaseResponse<TEntityType[]> {
  protected tableRowColumns: string[][] = [];

  constructor(
    protected entityTerm: string,
    data: TEntityType[] = [],
    protected tableColumnHeadings: Partial<{
      [columnName in keyof TEntityType]: string;
    }> = {},
  ) {
    super(
      true,
      `${data.length} ${entityTerm}${data.length === 1 ? "" : "s"} found`,
      data,
    );

    this.tableRowColumns = [];
    this.tableRowColumns.push(Object.values(tableColumnHeadings));
    this.getData().forEach((entity) => {
      const tableColumnHeadingsKeys = Object.keys(tableColumnHeadings);
      this.tableRowColumns.push(
        tableColumnHeadingsKeys.map(
          (key) => entity[key as keyof TEntityType] + "",
        ),
      );
    });
  }

  protected guiResponseToConsole(): never {
    console.log(
      table(this.tableRowColumns, {
        header: {
          alignment: "center",
          content: this.getMessage(),
        },
      }),
    );
    process.exit(0);
  }

  protected jsonResponseToConsole(): never {
    console.log(JSON.stringify(this.toJson()));

    process.exit(0);
  }
}

export default TableResponse;
