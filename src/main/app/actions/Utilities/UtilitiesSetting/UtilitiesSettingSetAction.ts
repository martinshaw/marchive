/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: setting.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/
import logger from '../../../../log'
import { getOrSetStoredSetting } from '../../../../app/repositories/StoredSettingRepository'
import { StoredSettingAttributes } from 'main/database/models/StoredSetting'

/**
 * @throws {Error}
 */
const UtilitiesSettingSetAction = async (key: string, value: string): Promise<StoredSettingAttributes | never> => {
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

export default UtilitiesSettingSetAction
