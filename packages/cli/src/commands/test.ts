import commander from "commander";
import { appLogsPath } from "logger";
import {
  dataSource,
  userAppDataDatabaseFilePath,
  userAppDataDatabasesPath,
} from "database";
import { getStoredSettingValue } from "database/src/repositories/StoredSettingRepository";
import process from "node:process";
import {
  readOnlyBrowserExtensionsPath,
  readOnlyChromiumExecutablePath,
} from "data-providers/src/paths";
import { userAppDataPath } from "utilities";
import { performPuppeteerTest } from "data-providers";

const Test = new commander.Command("test");

Test.description(
  "Display paths, test connection to database and Puppeteer functionality"
).action(async (options, program) => {
  console.log("Displaying Global Flags: ");

  const optionsWithGlobals = program.optsWithGlobals();

  console.log(
    `   Called with --log-to-console: ${
      optionsWithGlobals.logToConsole ? "YES" : "NO"
    } (env value: ${process.env.MARCHIVE_CLI_LOG_TO_CONSOLE})`
  );
  console.log(
    `   Called with --json: ${optionsWithGlobals.json ? "YES" : "NO"}`
  );

  console.log("Displaying Paths: ");

  console.log(`   process.execPath: ${process.execPath}`);
  console.log(`   process.cwd(): ${process.cwd()}`);
  console.log(`   __dirname: ${__dirname}`);
  console.log(`   __filename: ${__filename}`);
  console.log(`   process.argv: ${process.argv}`);

  console.log(
    `   readOnlyChromiumExecutablePath: ${readOnlyChromiumExecutablePath}`
  );
  console.log(
    `   readOnlyBrowserExtensionsPath: ${readOnlyBrowserExtensionsPath}`
  );
  console.log(`   userAppDataPath: ${userAppDataPath}`);
  console.log(`   logsPath: ${appLogsPath}`);
  console.log(`   userAppDataDatabasesPath: ${userAppDataDatabasesPath}`);
  console.log(`   userAppDataDatabaseFilePath: ${userAppDataDatabaseFilePath}`);

  console.log("Testing Database: ");

  console.log(
    `   Connection to Database: ${dataSource.isInitialized ? "YES" : "NO"}`
  );

  console.log(`   Retrieve data from Database: `);
  console.log(
    `      MARCHIVE_IS_SETUP: ${await getStoredSettingValue(
      "MARCHIVE_IS_SETUP"
    )}`
  );
  console.log(
    `      CLI_IS_USED: ${await getStoredSettingValue("CLI_IS_USED")}`
  );
  console.log(
    `      SCHEDULE_RUN_PROCESS_IS_PAUSED: ${await getStoredSettingValue(
      "SCHEDULE_RUN_PROCESS_IS_PAUSED"
    )}`
  );
  console.log(
    `      CAPTURE_PART_RUN_PROCESS_IS_PAUSED: ${await getStoredSettingValue(
      "CAPTURE_PART_RUN_PROCESS_IS_PAUSED"
    )}`
  );

  console.log("Testing Puppeteer: ");

  performPuppeteerTest();
});

export default Test;
