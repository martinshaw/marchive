/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: connection.ts
Created:  2023-08-17T09:13:34.630Z
Modified: 2023-08-17T09:13:34.630Z

Description: description
*/

import path from 'node:path'
import { userAppDataPath } from '../../paths';
import { Sequelize } from 'sequelize-typescript'

const databasePath = path.join(userAppDataPath, 'database.db')

const sequelize = new Sequelize(
  {
    dialect: 'sqlite',
    storage: databasePath,
    logging: false,
  }
)

sequelize
  .authenticate()
  .then(() => {
    //
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize
