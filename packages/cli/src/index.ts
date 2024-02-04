import commander from "commander";
import process from "node:process";
import { dataSource } from "database";
import logToConsoleGlobalOption from "./options/logToConsoleGlobalOption";
import jsonGlobalOption from "./options/jsonGlobalOption";
import Test from "./commands/Test";
import SourceCreate from "./commands/Source/SourceCreate";
import SourceCount from "./commands/Source/SourceCount";
import SourceList from "./commands/Source/SourceList";
import SourceDelete from "./commands/Source/SourceDelete";
import SourceDomainCount from "./commands/SourceDomain/SourceDomainCount";
import SourceDomainList from "./commands/SourceDomain/SourceDomainList";
import StoredSettingList from "./commands/StoredSetting/StoredSettingList";
import StoredSettingGet from "./commands/StoredSetting/StoredSettingGet";
import StoredSettingSet from "./commands/StoredSetting/StoredSettingSet";
import StoredSettingUnset from "./commands/StoredSetting/StoredSettingUnset";
import CaptureList from "./commands/Capture/CaptureList";
import CaptureDelete from "./commands/Capture/CaptureDelete";
import DataProviderList from "./commands/DataProvider/DataProviderList";
import DataProviderValidate from "./commands/DataProvider/DataProviderValidate";
import ScheduleCreate from "./commands/Schedule/ScheduleCreate";
import ScheduleUpdate from "./commands/Schedule/ScheduleUpdate";
import ScheduleCount from "./commands/Schedule/ScheduleCount";
import ScheduleList from "./commands/Schedule/ScheduleList";
import ScheduleDelete from "./commands/Schedule/ScheduleDelete";

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
    .addCommand(SourceDomainCount)

    // Source related commands
    .addCommand(SourceList)
    .addCommand(SourceCount)
    .addCommand(SourceCreate)
    .addCommand(SourceDelete)

    // Capture related commands
    .addCommand(CaptureList)
    .addCommand(CaptureDelete)

    // Data Provider related commands
    .addCommand(DataProviderList)
    .addCommand(DataProviderValidate)

    // Schedule related commands
    .addCommand(ScheduleCreate)
    .addCommand(ScheduleUpdate)
    .addCommand(ScheduleCount)
    .addCommand(ScheduleList)
    .addCommand(ScheduleDelete)

    .addCommand(Test)
    .helpOption("-h, --help", "Display help for command")
    .parse(process.argv);
})();
