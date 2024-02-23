import commander from "commander";
import process from "node:process";
import { dataSource } from "database";
import logToConsoleGlobalOption from "./options/logToConsoleGlobalOption";
import jsonGlobalOption from "./options/jsonGlobalOption";

import SourceList from "./commands/Source/SourceList/command";
import SourceShow from "./commands/Source/SourceShow/command";
import SourceCount from "./commands/Source/SourceCount/command";
import SourceCreate from "./commands/Source/SourceCreate/command";
import SourceDelete from "./commands/Source/SourceDelete/command";

import SourceDomainList from "./commands/SourceDomain/SourceDomainList/command";
import SourceDomainShow from "./commands/SourceDomain/SourceDomainShow/command";
import SourceDomainCount from "./commands/SourceDomain/SourceDomainCount/command";

import StoredSettingList from "./commands/StoredSetting/StoredSettingList/command";
import StoredSettingGet from "./commands/StoredSetting/StoredSettingGet/command";
import StoredSettingSet from "./commands/StoredSetting/StoredSettingSet/command";
import StoredSettingUnset from "./commands/StoredSetting/StoredSettingUnset/command";

import CaptureList from "./commands/Capture/CaptureList/command";
import CaptureShow from "./commands/Capture/CaptureShow/command";
import CaptureDelete from "./commands/Capture/CaptureDelete/command";

import DataProviderList from "./commands/DataProvider/DataProviderList/command";
import DataProviderShow from "./commands/DataProvider/DataProviderShow/command";
import DataProviderValidate from "./commands/DataProvider/DataProviderValidate/command";

import ScheduleList from "./commands/Schedule/ScheduleList/command";
import ScheduleShow from "./commands/Schedule/ScheduleShow/command";
import ScheduleCount from "./commands/Schedule/ScheduleCount/command";
import ScheduleCreate from "./commands/Schedule/ScheduleCreate/command";
import ScheduleUpdate from "./commands/Schedule/ScheduleUpdate/command";
import ScheduleDelete from "./commands/Schedule/ScheduleDelete/command";

import WatchSchedules from "./commands/Watch/WatchSchedules";
import WatchCaptureParts from "./commands/Watch/WatchCaptureParts";

import UtilitiesRetrieveFavicon from "./commands/Utilities/UtilitiesRetrieveFavicon/command";
import UtilitiesAddCliToPath from "./commands/Utilities/UtilitiesAddCliToPath/command";
import UtilitiesTest from "./commands/Utilities/UtilitiesTest";
import UtilitiesIpc from "./commands/Utilities/UtilitiesIpc";

(async () => {
  if (dataSource.isInitialized !== true) await dataSource.initialize();

  const program = new commander.Command();

  program
    .name("marchive-cli")
    .nameFromFilename("marchive-cli")
    .version("0.0.2")
    .description("Marchive CLI")
    .addOption(logToConsoleGlobalOption)
    .addOption(jsonGlobalOption)

    // Stored Setting related commands
    .addCommand(StoredSettingList)
    .addCommand(StoredSettingGet)
    .addCommand(StoredSettingSet)
    .addCommand(StoredSettingUnset)

    // Source Domain related commands
    .addCommand(SourceDomainList)
    .addCommand(SourceDomainShow)
    .addCommand(SourceDomainCount)

    // Source related commands
    .addCommand(SourceList)
    .addCommand(SourceShow)
    .addCommand(SourceCount)
    .addCommand(SourceCreate)
    .addCommand(SourceDelete)

    // Capture related commands
    .addCommand(CaptureList)
    .addCommand(CaptureShow)
    .addCommand(CaptureDelete)

    // Data Provider related commands
    .addCommand(DataProviderList)
    .addCommand(DataProviderShow)
    .addCommand(DataProviderValidate)

    // Schedule related commands
    .addCommand(ScheduleList)
    .addCommand(ScheduleShow)
    .addCommand(ScheduleCount)
    .addCommand(ScheduleCreate)
    .addCommand(ScheduleUpdate)
    .addCommand(ScheduleDelete)

    // Watch (daemon) related commands
    .addCommand(WatchSchedules)
    .addCommand(WatchCaptureParts)

    // Utilities commands
    .addCommand(UtilitiesTest)
    .addCommand(UtilitiesIpc)
    .addCommand(UtilitiesRetrieveFavicon)
    .addCommand(UtilitiesAddCliToPath)

    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);
})();
