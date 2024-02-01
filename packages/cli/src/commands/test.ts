import commander from "commander";
import logger, { appLogsPath } from "logger";
import {
  dataSource,
  userAppDataDatabaseFilePath,
  userAppDataDatabasesPath,
} from "database";
import { getStoredSettingValue } from "database/src/repositories/StoredSettingRepository";
import {
  PageHeadMetadata,
  createPuppeteerBrowser,
  generatePageMetadata,
  loadPageByUrl,
} from "data-providers";
import { Browser, Page } from "puppeteer-core";
import process from "node:process";
import {
  readOnlyBrowserExtensionsPath,
  readOnlyChromiumExecutablePath,
} from "data-providers/src/paths";
import { userAppDataPath } from "utilities";

const test = new commander.Command("test");

test
  .description(
    "Display paths, test connection to database and Puppeteer functionality"
  )
  .action(async (options, program) => {
    console.log("### Displaying Global Flags ###");

    const optionsWithGlobals = program.optsWithGlobals();

    console.log(
      `    Called with --log-to-console: ${
        optionsWithGlobals.logToConsole ? "YES" : "NO"
      } (env value: ${process.env.MARCHIVE_CLI_LOG_TO_CONSOLE})`
    );
    console.log(
      `    Called with --json: ${optionsWithGlobals.json ? "YES" : "NO"}`
    );

    console.log("### Displaying Paths ###");

    console.log(`    process.execPath: ${process.execPath}`);
    console.log(`    process.cwd(): ${process.cwd()}`);
    console.log(`    __dirname: ${__dirname}`);
    console.log(`    __filename: ${__filename}`);
    console.log(`    process.argv: ${process.argv}`);

    console.log(
      `    readOnlyChromiumExecutablePath: ${readOnlyChromiumExecutablePath}`
    );
    console.log(
      `    readOnlyBrowserExtensionsPath: ${readOnlyBrowserExtensionsPath}`
    );
    console.log(`    userAppDataPath: ${userAppDataPath}`);
    console.log(`    logsPath: ${appLogsPath}`);
    console.log(`    userAppDataDatabasesPath: ${userAppDataDatabasesPath}`);
    console.log(
      `    userAppDataDatabaseFilePath: ${userAppDataDatabaseFilePath}`
    );

    console.log("### Testing Database ###");

    console.log(
      `Connection to Database: ${dataSource.isInitialized ? "YES" : "NO"}`
    );

    console.log(`Retrieve data from Database: `);
    console.log(
      `    MARCHIVE_IS_SETUP: ${await getStoredSettingValue(
        "MARCHIVE_IS_SETUP"
      )}`
    );
    console.log(
      `    CLI_IS_USED: ${await getStoredSettingValue("CLI_IS_USED")}`
    );
    console.log(
      `    SCHEDULE_RUN_PROCESS_IS_PAUSED: ${await getStoredSettingValue(
        "SCHEDULE_RUN_PROCESS_IS_PAUSED"
      )}`
    );
    console.log(
      `    CAPTURE_PART_RUN_PROCESS_IS_PAUSED: ${await getStoredSettingValue(
        "CAPTURE_PART_RUN_PROCESS_IS_PAUSED"
      )}`
    );

    console.log("### Testing Puppeteer ###");

    let browser: Browser | null = null;

    try {
      browser = await createPuppeteerBrowser();
    } catch (error) {
      logger.error("Creation of headless Chromium browser: NO");
      logger.error(error);

      return process.exit(0);
    }

    console.log("Creation of headless Chromium browser: YES");

    let page: Page | null = null;

    try {
      page = await loadPageByUrl("https://www.google.com", browser);
    } catch (error) {
      logger.error("Loading of page: NO");
      logger.error(error);

      return process.exit(0);
    }

    console.log("Loading of page: YES");

    let metadata: false | PageHeadMetadata = false;

    try {
      metadata = await generatePageMetadata(
        page,
        "/Users/martinshaw-maltamac/Desktop"
      );
    } catch (error) {
      logger.error("Generation of page metadata: NO");
      logger.error(error);

      return process.exit(0);
    }

    if (metadata === false) {
      logger.error("Generation of page metadata: NO (metadata is false)");
      return process.exit(0);
    }

    await page.close();
    await browser.close();

    console.log("Generation of page metadata: YES", { metadata });
  });

export default test;
