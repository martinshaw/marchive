/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: connection.ts
Created:  2023-08-17T09:13:34.630Z
Modified: 2023-08-17T09:13:34.630Z

Description: description
*/

import fs from 'node:fs'
import logger from '../app/log';
import { Sequelize } from 'sequelize-typescript'
import { userAppDataDatabaseFilePath, userAppDataDatabasesPath } from '../../paths';

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
  .then(() => {
    logger.info(`Sequelize: Connection has been established successfully. Using database file: ${userAppDataDatabaseFilePath}`);
   })
  .catch(error => {
    logger.error('Sequelize: Unable to connect to the database');
    logger.error(error);
  });

export default sequelize
