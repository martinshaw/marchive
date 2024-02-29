/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowFiles.ts
Created:  2024-02-01T16:12:37.651Z
Modified: 2024-02-01T16:12:37.651Z

Description: description
*/

import fs from "node:fs";
import { Capture } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import TableResponse from "../../../responses/TableResponse";
import generateFileTypeFilteringFromCommandOption, {
  ShowFilesCommandFilterOptionValueType,
} from "../../../options/generateFileTypeFilteringFromCommandOption";

export const [
  addFileTypeFilteringCommanderOption,
  determineFilesTypeFilteredFromCommanderOption,
] = generateFileTypeFilteringFromCommandOption();

const CaptureShowFiles = async (
  captureId: number,
  optionsAndArguments: {
    [key: string]: string | number | boolean;
  },
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const capture = await Capture.findOne({
      where: { id: captureId },
    });
    if (capture == null) {
      return new ErrorResponse(`No capture found with ID ${captureId}`);
    }

    const captureFiles = determineFilesTypeFilteredFromCommanderOption(
      optionsAndArguments.filter as ShowFilesCommandFilterOptionValueType,
      fs.readdirSync(capture.downloadLocation),
      capture.downloadLocation,
    );

    return new TableResponse<{ name: string }>(
      `File`,
      captureFiles.map((name) => ({ name })),
      {
        name: "File Name",
      },
    );
  });
};

export default CaptureShowFiles;
