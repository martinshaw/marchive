/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: generateFileTypeFilteringFromCommandOption.ts
Created:  2024-02-29T06:18:28.461Z
Modified: 2024-02-29T06:18:28.461Z

Description: description
*/

/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: generateFileTypeFilteringFromCommandOption.ts
Created:  2024-02-02T00:08:21.283Z
Modified: 2024-02-02T00:08:21.283Z

Description: description
*/

import { Command, Option } from "commander";
import fs from "node:fs";
import path from "node:path";
import {
  ImageExtensionType,
  imageExtensions,
} from "common-types/src/files-extensions/images";
import {
  AudioExtensionType,
  audioExtensions,
} from "common-types/src/files-extensions/audio";
import {
  VideoExtensionType,
  videoExtensions,
} from "common-types/src/files-extensions/video";

type ShowFilesCommandFilterOptionValueType =
  | "image"
  | "video"
  | "audio"
  | "json"
  | "directory";

type GenerateFileTypeFilteringFromCommandOptionAddFileTypeFilteringCommanderOptionFunctionType =
  (command: Command) => Command;

type GenerateFileTypeFilteringFromCommandOptionDetermineFilesTypeFilteredFromCommanderOptionFunctionType =
  (
    filter: ShowFilesCommandFilterOptionValueType | undefined,
    files: string[],
    basePath: string,
  ) => string[];

const filters: Record<
  ShowFilesCommandFilterOptionValueType,
  (files: string[], basePath: string) => string[]
> = {
  image: (files: string[], basePath: string) =>
    files.filter((file) => {
      const extension = file.split(".").pop() as ImageExtensionType;
      return extension == null ? false : imageExtensions.includes(extension);
    }),
  video: (files: string[], basePath: string) =>
    files.filter((file) => {
      const extension = file.split(".").pop() as VideoExtensionType;
      return extension == null ? false : videoExtensions.includes(extension);
    }),
  audio: (files: string[], basePath: string) =>
    files.filter((file) => {
      const extension = file.split(".").pop() as AudioExtensionType;
      return extension == null ? false : audioExtensions.includes(extension);
    }),
  json: (files: string[], basePath: string) =>
    files.filter((file) => file.endsWith(".json")),
  directory: (files: string[], basePath: string) =>
    files.filter((file) =>
      fs.lstatSync(path.join(basePath, file)).isDirectory(),
    ),
};

const generateFileTypeFilteringFromCommandOption: () => [
  GenerateFileTypeFilteringFromCommandOptionAddFileTypeFilteringCommanderOptionFunctionType,
  GenerateFileTypeFilteringFromCommandOptionDetermineFilesTypeFilteredFromCommanderOptionFunctionType,
] = () => {
  const addFileTypeFilteringCommanderOption: GenerateFileTypeFilteringFromCommandOptionAddFileTypeFilteringCommanderOptionFunctionType =
    (command) => {
      command = command.addOption(
        new Option(
          "-f, --filter <filter>",
          "Filter by type (e.g. image, video, audio, json, directory)",
        ),
      );

      return command;
    };

  const determineFilesTypeFilteredFromCommanderOption: GenerateFileTypeFilteringFromCommandOptionDetermineFilesTypeFilteredFromCommanderOptionFunctionType =
    (filter, files, basePath) => {
      if (filter == null) return files;

      return filters[filter](files, basePath);
    };

  return [
    addFileTypeFilteringCommanderOption,
    determineFilesTypeFilteredFromCommanderOption,
  ];
};

export default generateFileTypeFilteringFromCommandOption;
export {
  type GenerateFileTypeFilteringFromCommandOptionAddFileTypeFilteringCommanderOptionFunctionType,
  type GenerateFileTypeFilteringFromCommandOptionDetermineFilesTypeFilteredFromCommanderOptionFunctionType,
  type ShowFilesCommandFilterOptionValueType,
};
