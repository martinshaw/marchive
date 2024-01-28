import commander from "commander";
import logger from "logger";

import { SourceDomain, dataSource } from "typeorm-database";

const hello = new commander.Command("hello");

hello.description("Hello world").action(async () => {
  logger.info("Hello world", { ok: dataSource.isInitialized });

  const sourceDomain = SourceDomain.create({
    name: "Example",
    url: "https://www.example.com/",
  });
  await sourceDomain.save();

  logger.info("SourceDomain", { sourceDomain });
});

export default hello;
