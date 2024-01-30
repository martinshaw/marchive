import commander from "commander";
import logger from "logger";

import { StoredSetting, dataSource } from "database";
import { setStoredSettingValue } from "database/src/repositories/StoredSettingRepository";

import {
  createPuppeteerBrowser,
  generatePageMetadata,
  loadPageByUrl,
  scrollPageToTop,
  smoothlyScrollPageToBottom,
} from "data-providers";

const hello = new commander.Command("hello");

hello.description("Hello world").action(async () => {
  logger.info("Testing DB ", { it_connects: dataSource.isInitialized });

  const settingValue = await setStoredSettingValue("MARCHIVE_IS_SETUP", "true");

  logger.info("Testing DB ", { it_works: settingValue });

  logger.info("Testing Puppeteer ");

  const browser = await createPuppeteerBrowser();
  const page = await loadPageByUrl("https://www.google.com", browser);
  await scrollPageToTop(page);
  await smoothlyScrollPageToBottom(page);
  const metadata = await generatePageMetadata(
    page,
    "/Users/martinshaw-maltamac/Desktop"
  );

  await page.close();
  await browser.close();

  logger.info("Testing Puppeteer ", { is_working: metadata });
});

export default hello;
