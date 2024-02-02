import commander, { Option } from "commander";
import process from "node:process";
import { dataSource } from "database";
import logToConsoleGlobalOption from "./options/logToConsoleGlobalOption";
import jsonGlobalOption from "./options/jsonGlobalOption";
import Test from "./commands/Test";
import SourceCreate from "./commands/Source/SourceCreate";
import SourceCount from "./commands/Source/SourceCount";
import SourceList from "./commands/Source/SourceList";
import SourceDelete from "./commands/Source/SourceDelete";

(async () => {
  if (dataSource.isInitialized !== true) await dataSource.initialize();

  const program = new commander.Command();

  program
    .version("0.0.2")
    .description("Marchive CLI")
    .addOption(logToConsoleGlobalOption)
    .addOption(jsonGlobalOption)
    .addCommand(Test)
    .addCommand(SourceCreate)
    .addCommand(SourceCount)
    .addCommand(SourceList)
    .addCommand(SourceDelete)
    .parse(process.argv);
})();
