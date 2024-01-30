import commander from "commander";
import logger from "logger";

import { StoredSetting, dataSource } from "database";
import { setStoredSettingValue } from "database/src/repositories/StoredSettingRepository";

const hello = new commander.Command("hello");

hello.description("Hello world").action(async () => {
  logger.info("Hello world", { ok: dataSource.isInitialized });

  const setting = await setStoredSettingValue("MARCHIVE_IS_SETUP", "true");

  logger.info("storedSetting", { setting });
});

export default hello;
