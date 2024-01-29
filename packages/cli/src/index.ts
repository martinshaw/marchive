import commander from "commander";
import process from "node:process";
import hello from "./commands/hello";
import { dataSource } from "database";

(async () => {
  if (dataSource.isInitialized !== true) await dataSource.initialize();

  const program = new commander.Command();

  program
    .version("0.0.2")
    .description("Marchive CLI")
    .addCommand(hello)
    .parse(process.argv);
})();
