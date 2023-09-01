/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingRepository.ts
Created:  2023-08-01T23:05:48.537Z
Modified: 2023-08-01T23:05:48.537Z

Description: description
*/

import {StoredSetting} from '../../database'
import {StoredSettingKeyType, StoredSettingTypeType} from '../../database/models/StoredSetting'

const determineStoredSettingValueType = (value: string | number | boolean): StoredSettingTypeType => {
  if (value === true || value === false || value === 'true' || value === 'false') return 'boolean'
  if (!Number.isNaN(Number(value))) return 'number'
  return 'string'
}

export const getOrSetStoredSetting = async <T = string | number | boolean>(
  key: StoredSettingKeyType,
  newValue: T | null = null,
): Promise<StoredSetting | null> => {
  const existingStoredSetting = await StoredSetting.findOne({where: {key}})

  if (existingStoredSetting == null && newValue == null) return null

  if (existingStoredSetting != null && newValue == null) return existingStoredSetting

  if (existingStoredSetting == null && newValue != null)
    return StoredSetting.create({
      key,
      value: newValue.toString(),
      type: determineStoredSettingValueType(newValue as string | number | boolean),
    })

  if (existingStoredSetting != null && newValue != null)
    return existingStoredSetting.update({
      value: newValue.toString(),
      type: determineStoredSettingValueType(newValue as string | number | boolean),
    })

  return null
}

export const unsetStoredSetting = async (key: StoredSettingKeyType): Promise<boolean> => {
  const existingStoredSetting = await StoredSetting.findOne({where: {key}})
  if (existingStoredSetting == null) return false
  await existingStoredSetting.destroy()
  return true
}

export const getStoredSettingValue = async (
  key: StoredSettingKeyType,
): Promise<string | number | boolean | null> => {
  const storedSetting = await getOrSetStoredSetting(key)
  if (storedSetting == null) return null
  if (storedSetting.value == null) return null

  switch (storedSetting.type) {
  case 'string': return storedSetting.value.toString()
  case 'number': return Number(storedSetting.value)
  case 'boolean': return storedSetting.value === 'true'
  }

  return null
}

export const setStoredSettingValue = async (
  key: StoredSettingKeyType,
  value: string | number | boolean,
): Promise<string | number | boolean | null> => {
  const storedSetting = await getOrSetStoredSetting(key, value)
  if (storedSetting == null) return null
  if (storedSetting.value == null) return null

  switch (storedSetting.type) {
  case 'string': return storedSetting.value.toString()
  case 'number': return Number(storedSetting.value)
  case 'boolean': return storedSetting.value === 'true'
  }

  return null
}
