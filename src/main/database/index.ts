/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-01T22:08:30.334Z
Modified: 2023-08-01T22:08:30.334Z

Description: description
*/

import sequelize from './connection';
import StoredSetting from './models/StoredSetting';

sequelize.addModels([StoredSetting]);
StoredSetting.sync();

export { sequelize, StoredSetting };
