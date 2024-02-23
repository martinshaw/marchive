/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettings.ts
Created:  2024-02-23T16:10:25.565Z
Modified: 2024-02-23T16:10:25.565Z

Description: description
*/

import { ipcMain } from 'electron';
import { StoredSettingKeyType } from 'common-types/src/entities/StoredSetting';
import StoredSettingGetAction from '../app/actions/StoredSetting/StoredSettingGetAction';
import StoredSettingSetAction from '../app/actions/StoredSetting/StoredSettingSetAction';
import StoredSettingUnsetAction from '../app/actions/StoredSetting/StoredSettingUnsetAction';

export type StoredSettingsChannels =
  | 'stored-settings.get'
  | 'stored-settings.set'
  | 'stored-settings.unset';

ipcMain.on('stored-settings.get', async (event, key: StoredSettingKeyType) => {
  return StoredSettingGetAction(key)
    .then((response) => {
      event.reply('stored-settings.get', response, null);
    })
    .catch((error) => {
      event.reply('stored-settings.get', null, error);
    });
});

ipcMain.on(
  'stored-settings.set',
  async (event, key: StoredSettingKeyType, value: string) => {
    return StoredSettingSetAction(key, value)
      .then((response) => {
        event.reply('stored-settings.set', response, null);
      })
      .catch((error) => {
        event.reply('stored-settings.set', null, error);
      });
  },
);

ipcMain.on(
  'stored-settings.unset',
  async (event, key: StoredSettingKeyType) => {
    return StoredSettingUnsetAction(key)
      .then((response) => {
        event.reply('stored-settings.unset', response, null);
      })
      .catch((error) => {
        event.reply('stored-settings.unset', null, error);
      });
  },
);
