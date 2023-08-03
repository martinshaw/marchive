/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingRepository.ts
Created:  2023-08-01T23:05:48.537Z
Modified: 2023-08-01T23:05:48.537Z

Description: description
*/

import { StoredSetting } from '../database';

export const isMarchiveAlreadySetup = async () => {
  const storedSetting = await StoredSetting.findOne({
    where: {
      key: 'marchiveIsSetup',
    },
  });

  return storedSetting?.value === 'true';
};

export const setMarchiveIsSetup = async (isSetup: boolean) => {
  const storedSetting = await StoredSetting.findOne({
    where: {
      key: 'marchiveIsSetup',
    },
  });

  if (storedSetting) {
    storedSetting.value = isSetup ? 'true' : 'false';
    await storedSetting.save();
  } else {
    await StoredSetting.create({
      key: 'marchiveIsSetup',
      value: isSetup ? 'true' : 'false',
    });
  }
};
