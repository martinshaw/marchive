/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingGetAction.ts
Created:  2023-08-29T21:25:45.800Z
Modified: 2023-08-29T21:25:45.800Z

Description: description
*/

import { type StoredSettingEntityType } from 'common-types';
import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const StoredSettingGetAction = async (
  key: string,
): Promise<StoredSettingEntityType> =>
  runCliCommand<StoredSettingEntityType>('stored-setting:get', [key]).then(
    (response) => response.getData()[0],
  );

export default StoredSettingGetAction;
