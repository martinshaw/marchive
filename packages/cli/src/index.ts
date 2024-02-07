import commander from "commander";
import process from "node:process";
import { dataSource } from "database";
import logToConsoleGlobalOption from "./options/logToConsoleGlobalOption";
import jsonGlobalOption from "./options/jsonGlobalOption";

import Test from "./commands/Test";

import SourceList from "./commands/Source/SourceList";
import SourceShow from "./commands/Source/SourceShow";
import SourceCount from "./commands/Source/SourceCount";
import SourceCreate from "./commands/Source/SourceCreate";
import SourceDelete from "./commands/Source/SourceDelete";

import SourceDomainList from "./commands/SourceDomain/SourceDomainList";
import SourceDomainShow from "./commands/SourceDomain/SourceDomainShow";
import SourceDomainCount from "./commands/SourceDomain/SourceDomainCount";

import StoredSettingList from "./commands/StoredSetting/StoredSettingList";
import StoredSettingGet from "./commands/StoredSetting/StoredSettingGet";
import StoredSettingSet from "./commands/StoredSetting/StoredSettingSet";
import StoredSettingUnset from "./commands/StoredSetting/StoredSettingUnset";

import CaptureList from "./commands/Capture/CaptureList";
import CaptureShow from "./commands/Capture/CaptureShow";
import CaptureDelete from "./commands/Capture/CaptureDelete";

import DataProviderList from "./commands/DataProvider/DataProviderList";
import DataProviderShow from "./commands/DataProvider/DataProviderShow";
import DataProviderValidate from "./commands/DataProvider/DataProviderValidate";

import ScheduleList from "./commands/Schedule/ScheduleList";
import ScheduleShow from "./commands/Schedule/ScheduleShow";
import ScheduleCount from "./commands/Schedule/ScheduleCount";
import ScheduleCreate from "./commands/Schedule/ScheduleCreate";
import ScheduleUpdate from "./commands/Schedule/ScheduleUpdate";
import ScheduleDelete from "./commands/Schedule/ScheduleDelete";

import WatchSchedules from "./commands/Watch/WatchSchedules";
import WatchCaptureParts from "./commands/Watch/WatchCaptureParts";

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

    .addCommand(Test)
    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);
})();
