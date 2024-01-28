/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-17T09:12:39.365Z
Modified: 2023-08-17T09:12:39.366Z

Description: description
*/

import fs from "node:fs";
import path from "node:path";
import logger from "logger";
import {
  userAppDataDatabaseFilePath,
  userAppDataDatabasesPath,
} from "./databasePaths";

// import { readOnlyInternalDatabaseMigrationsPath } from "./databasePaths";
// import { convertCrossPlatformSlashPathToNodePath } from "utilities";

// import StoredSetting from './models/StoredSetting'
// import Source from './models/Source'
import SourceDomain from "./models/SourceDomain";
// import Schedule from './models/Schedule'
// import Capture from './models/Capture'
// import CapturePart from './models/CapturePart'

import { DataSource, Entity, Migration } from "typeorm";
if (fs.existsSync(userAppDataDatabasesPath) === false)
  fs.mkdirSync(userAppDataDatabasesPath, { recursive: true });

const dataSource = new DataSource({
  type: "better-sqlite3",
  database: userAppDataDatabaseFilePath,
  entities: [SourceDomain],
  migrations: [],
  synchronize: true,
});

dataSource
  .initialize()
  .then(async () => {
    logger.info(
      `DB: Connection has been established successfully. Using database file: ${userAppDataDatabaseFilePath}`
    );
  })
  .catch((error) => {
    console.log("DATABSE ERROR", error, error?.message);
    logger.error("DB: Unable to connect to the database");
    logger.error(error);
  });

// import { retrieveDueSchedules } from './repositories/ScheduleRepository'
// import { getStoredSettingValue } from './repositories/StoredSettingRepository'

export {
  // retrieveDueSchedules,
  // getStoredSettingValue,

  dataSource,

  // StoredSetting,
  // Source,
  SourceDomain,
  // Schedule,
  // Capture,
  // CapturePart,
};
