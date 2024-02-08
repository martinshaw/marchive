/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilitySettingUnsetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import logger from 'logger';
// import { StoredSettingKeyType } from 'database/src/models/StoredSetting';
// import { unsetStoredSetting } from 'database/src/repositories/StoredSettingRepository';

/**
 * @throws {Error}
 */
const UtilitySettingUnsetAction = async (
  // key: StoredSettingKeyType
  key: any,
): Promise<void | never> => {
  // if (key == null) {
  //   const errorMessage = 'You must provide a key when unsetting a setting';
  //   logger.error(errorMessage);
  //   throw new Error(errorMessage);
  // }
  // await unsetStoredSetting(key);
  // logger.info(`Unset setting with key: ${key}`);
};

export default UtilitySettingUnsetAction;
