/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSettingRepository.ts
Created:  2023-08-01T23:05:48.537Z
Modified: 2023-08-01T23:05:48.537Z

Description: description
*/

import logger from "logger";
import {
  type StoredSettingKeyType,
  type StoredSettingTypeType,
} from "common-types/src/entities/StoredSetting";
import { StoredSetting } from "../..";

const determineStoredSettingValueType = (
  value: string | number | boolean,
): StoredSettingTypeType => {
  if (
    value === true ||
    value === false ||
    value === "true" ||
    value === "false"
  )
    return "boolean";
  if (!Number.isNaN(Number(value))) return "number";
  return "string";
};

const getOrSetStoredSetting = async <T = string | number | boolean>(
  key: StoredSettingKeyType,
  newValue: T | null = null,
): Promise<StoredSetting | null> => {
  let existingStoredSetting: StoredSetting | null = null;
  try {
    existingStoredSetting = await StoredSetting.findOne({ where: { key } });
  } catch (error) {
    logger.error("Unable to get stored setting due to database error:");
    logger.error(error);
  }

  if (existingStoredSetting == null && newValue == null) return null;
  if (existingStoredSetting != null && newValue == null)
    return existingStoredSetting;

  if (existingStoredSetting == null && newValue != null) {
    try {
      return await StoredSetting.save({
        key,
        value: newValue.toString(),
        type: determineStoredSettingValueType(
          newValue as string | number | boolean,
        ),
      });
    } catch (error) {
      logger.error(
        "A DB error occurred when attempting to create a new StoredSetting",
      );
      logger.error(error);
      return null;
    }
  }

  if (existingStoredSetting != null && newValue != null) {
    existingStoredSetting.value = newValue.toString();
    existingStoredSetting.type = determineStoredSettingValueType(
      newValue as string | number | boolean,
    );

    try {
      await existingStoredSetting.save();
      return existingStoredSetting;
    } catch (error) {
      logger.error(
        "A DB error occurred when attempting to update an existing StoredSetting",
      );
      logger.error(error);
      return null;
    }
  }

  return null;
};

const unsetStoredSetting = async (
  key: StoredSettingKeyType,
): Promise<boolean> => {
  let existingStoredSetting: StoredSetting | null = null;
  try {
    existingStoredSetting = await StoredSetting.findOne({ where: { key } });
  } catch (error) {
    logger.error("Unable to get stored setting due to database error:");
    logger.error(error);
  }

  if (existingStoredSetting == null) return false;
  await existingStoredSetting.softRemove();
  return true;
};

const getStoredSettingValue = async (
  key: StoredSettingKeyType,
): Promise<string | number | boolean | null> => {
  const storedSetting = await getOrSetStoredSetting(key);
  if (storedSetting == null) return null;
  if (storedSetting.value == null) return null;

  switch (storedSetting.type) {
    case "string":
      return storedSetting.value.toString();
    case "number":
      return Number(storedSetting.value);
    case "boolean":
      return storedSetting.value === "true";
  }

  return null;
};

const setStoredSettingValue = async (
  key: StoredSettingKeyType,
  value: string | number | boolean,
): Promise<string | number | boolean | null> => {
  const storedSetting = await getOrSetStoredSetting(key, value);
  if (storedSetting == null) return null;
  if (storedSetting.value == null) return null;

  switch (storedSetting.type) {
    case "string":
      return storedSetting.value.toString();
    case "number":
      return Number(storedSetting.value);
    case "boolean":
      return storedSetting.value === "true";
  }

  return null;
};

export {
  getOrSetStoredSetting,
  unsetStoredSetting,
  getStoredSettingValue,
  setStoredSettingValue,
};
