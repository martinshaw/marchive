import commander, { Option } from "commander";
import process from "node:process";
import test from "./commands/test";
import { dataSource } from "database";

(async () => {
  if (dataSource.isInitialized !== true) await dataSource.initialize();

  const program = new commander.Command();

  program
    .version("0.0.2")
    .description("Marchive CLI")
    .addOption(
      new Option(
        "-l, --log-to-console",
        "Print all logs to console (in addition to file)"
      )
        .env("MARCHIVE_CLI_LOG_TO_CONSOLE")
        .default(false)
    )
    .addOption(
      new Option("-j, --json", "Format all output as JSON")
        .default(false)
        .conflicts(["l"])
    )
    .addCommand(test)
    .parse(
      (() => {
        let args = process.argv;
        // args[0] = "marchive-cli";
        return args;
      })()
    );
})();
