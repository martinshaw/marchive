/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-17T09:12:39.365Z
Modified: 2023-08-17T09:12:39.366Z

Description: description
*/

import fs from "node:fs";
import { DataSource, DataSourceOptions } from "typeorm";
import logger from "logger";
import {
  userAppDataDatabaseFilePath,
  userAppDataDatabasesPath,
} from "./databasePaths";
import { retrieveDueSchedules } from "./repositories/ScheduleRepository";
import { getStoredSettingValue } from "./repositories/StoredSettingRepository";

import StoredSetting from "./entities/StoredSetting";
import Source from "./entities/Source";
import SourceDomain from "./entities/SourceDomain";
import Schedule from "./entities/Schedule";
import Capture from "./entities/Capture";
import CapturePart from "./entities/CapturePart";

import migrations from "./migrations";

if (fs.existsSync(userAppDataDatabasesPath) === false)
  fs.mkdirSync(userAppDataDatabasesPath, { recursive: true });

const dataSourceConfig: DataSourceOptions = {
  type: "better-sqlite3",
  database: userAppDataDatabaseFilePath,
  entities: [
    StoredSetting,
    Source,
    SourceDomain,
    Schedule,
    Capture,
    CapturePart,
  ],
  migrations,
  migrationsRun: true,
  synchronize: false,
  cache: true,
};

const dataSource = new DataSource(dataSourceConfig);

dataSource
  .initialize()
  .then(async () => {
    logger.info(
      `DB: Connection has been established successfully. Using database file: ${userAppDataDatabaseFilePath}`
    );
  })
  .catch((error) => {
    logger.error("DB: Unable to connect to the database");
    logger.error(error);
  });

export {
  retrieveDueSchedules,
  getStoredSettingValue,
  dataSource,
  StoredSetting,
  Source,
  SourceDomain,
  Schedule,
  Capture,
  CapturePart,
};
