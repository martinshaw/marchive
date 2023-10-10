/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilitySettingSetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import logger from 'logger';
import { getOrSetStoredSetting } from '../../../repositories/StoredSettingRepository'
import { StoredSettingAttributes, StoredSettingKeyType } from 'database/src/models/StoredSetting'

/**
 * @throws {Error}
 */
const UtilitySettingSetAction = async (key: StoredSettingKeyType, value: string): Promise<StoredSettingAttributes | never> => {
  if (key == null) {
    const errorMessage = 'You must provide a key when setting a setting'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (value == null) {
    const errorMessage = 'You must provide a value to set the setting for key: ' + key
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const storedSetting = await getOrSetStoredSetting(key, value)
  if (storedSetting == null) {
    const errorMessage = 'An error occurred while setting the setting with the key: ' + key
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  return storedSetting.toJSON()
}

export default UtilitySettingSetAction
