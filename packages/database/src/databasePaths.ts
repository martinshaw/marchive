/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: migrationPaths.ts
Created:  2023-10-10T06:32:11.514Z
Modified: 2023-10-10T06:32:11.514Z

Description: description
*/

import path from "node:path";
import { userAppDataPath } from "utilities";

const userAppDataDatabasesPath = path.join(userAppDataPath, "Databases");
const userAppDataDatabaseFilePath = path.join(
  userAppDataDatabasesPath,
  "marchive.db"
);

export {
  userAppDataPath,
  userAppDataDatabasesPath,
  userAppDataDatabaseFilePath,
};
