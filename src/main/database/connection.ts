/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: connection.ts
Created:  2023-08-17T09:13:34.630Z
Modified: 2023-08-17T09:13:34.630Z

Description: description
*/

import path from 'node:path'
import fs from 'node:fs'
import { userAppDataDatabaseFilePath, userAppDataDatabasesPath } from '../../paths';
import { Sequelize } from 'sequelize-typescript'
import logger from '../log';

console.log('CREATING DB IN ', userAppDataDatabaseFilePath, userAppDataDatabasesPath)

if (fs.existsSync(userAppDataDatabasesPath) === false) fs.mkdirSync(userAppDataDatabasesPath, { recursive: true })

const sequelize = new Sequelize(
  {
    dialect: 'sqlite',
    storage: userAppDataDatabaseFilePath,
    logging: false,
  }
)

sequelize
  .authenticate()
  .then(() => { /* */ })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

export default sequelize
