/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-08-17T09:12:39.365Z
Modified: 2023-08-17T09:12:39.366Z

Description: description
*/

import sequelize from './connection'
import StoredSetting from './models/StoredSetting'
import Source from './models/Source'
import Schedule from './models/Schedule'
import Capture from './models/Capture'
import CapturePart from './models/CapturePart'

sequelize.addModels([
  StoredSetting,
  Source,
  Schedule,
  Capture,
  CapturePart,
])

StoredSetting.sync()
Source.sync()
Schedule.sync()
Capture.sync()
CapturePart.sync()

export {
  sequelize,
  StoredSetting,
  Source,
  Schedule,
  Capture,
  CapturePart,
}
