/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-17T09:12:39.365Z
Modified: 2023-08-17T09:12:39.366Z

Description: description
*/
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'node:path'

import sequelize from './connection'

import StoredSetting from './models/StoredSetting'
import Source from './models/Source'
import SourceDomain from './models/SourceDomain'
import Schedule from './models/Schedule'
import Capture from './models/Capture'
import CapturePart from './models/CapturePart'

sequelize.addModels([
  StoredSetting,
  Source,
  SourceDomain,
  Schedule,
  Capture,
  CapturePart,
])

StoredSetting.sync()
Source.sync()
SourceDomain.sync()
Schedule.sync()
Capture.sync()
CapturePart.sync()

// console.log('umzug migrations path glob ', path.join(__dirname, 'migrations', '*'))

// const umzug = new Umzug({
//   migrations: { glob: path.join(__dirname, 'migrations', '*') },
//   context: sequelize.getQueryInterface(),
//   storage: new SequelizeStorage({ sequelize }),
//   logger: console,
// });

// (async () => { await umzug.up() })();

// export type Migration = typeof umzug._types.migration;
export {
  sequelize,
  StoredSetting,
  Source,
  SourceDomain,
  Schedule,
  Capture,
  CapturePart,
}
