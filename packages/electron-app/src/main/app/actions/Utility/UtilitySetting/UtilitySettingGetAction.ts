/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilitySettingGetAction.ts
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
const UtilitySettingGetAction = async (key: StoredSettingKeyType): Promise<StoredSettingAttributes | never> => {
    if (key == null) {
      const errorMessage = 'You must provide a key when getting a setting'
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    const storedSetting = await getOrSetStoredSetting(key)
    if (storedSetting == null) {
      const errorMessage = 'No setting found for key: ' + key
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    return storedSetting.toJSON()
}

export default UtilitySettingGetAction
