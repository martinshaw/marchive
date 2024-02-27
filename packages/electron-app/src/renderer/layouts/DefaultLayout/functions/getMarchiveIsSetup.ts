/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getMarchiveIsSetup.ts
Created:  2023-08-01T20:25:00.481Z
Modified: 2023-08-01T20:25:00.481Z

Description: description
*/

import { StoredSettingEntityType } from 'common-types';

const getMarchiveIsSetup = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'stored-settings.get',
      (response, error) => {
        if (error) {
          const errorMessage = (error as Error).message;

          // We will assume that this stored setting hasn't been set before, so just return false quietly
          return resolve(false);
        }

        const storedSetting = response as StoredSettingEntityType;

        return resolve(
          storedSetting.value === 'true' && storedSetting.type === 'boolean',
        );
      },
    );

    window.electron.ipcRenderer.sendMessage(
      'stored-settings.get',
      'MARCHIVE_IS_SETUP',
    );
  });
};

export default getMarchiveIsSetup;
