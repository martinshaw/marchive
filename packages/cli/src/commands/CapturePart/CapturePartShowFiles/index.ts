/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartShowFiles.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import fs from "node:fs";
import { CapturePart } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateFileTypeFilteringFromCommandOption, {
  ShowFilesCommandFilterOptionValueType,
} from "../../../options/generateFileTypeFilteringFromCommandOption";

export const [
  addFileTypeFilteringCommanderOption,
  determineFilesTypeFilteredFromCommanderOption,
] = generateFileTypeFilteringFromCommandOption();

const CapturePartShowFiles = async (
  capturePartId: number,
  optionsAndArguments: {
    [key: string]: string | number | boolean;
  },
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const capturePart = await CapturePart.findOne({
      where: { id: capturePartId },
    });
    if (capturePart == null) {
      return new ErrorResponse(
        `No capture part found with ID ${capturePartId}`,
      );
    }

    const capturePartFiles = determineFilesTypeFilteredFromCommanderOption(
      optionsAndArguments.filter as ShowFilesCommandFilterOptionValueType,
      fs.readdirSync(capturePart.downloadLocation),
      capturePart.downloadLocation,
    );

    return new TableResponse<{ name: string }>(
      `File`,
      capturePartFiles.map((name) => ({ name })),
      {
        name: "File Name",
      },
    );
  });
};

export default CapturePartShowFiles;
