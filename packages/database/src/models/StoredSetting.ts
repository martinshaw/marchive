/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSetting.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { DataTypes, Optional } from "sequelize";
import { Table, Model, Column } from "sequelize-typescript";

const storedSettingKeys = [
  "MARCHIVE_IS_SETUP",
  "SCHEDULE_RUN_PROCESS_IS_PAUSED",
  "CAPTURE_PART_RUN_PROCESS_IS_PAUSED",
] as const;
export type StoredSettingKeyType = (typeof storedSettingKeys)[number];

const storedSettingTypes = ["string", "number", "boolean"] as const;
export type StoredSettingTypeType = (typeof storedSettingTypes)[number];

export type StoredSettingAttributes = {
  id: number;
  key: StoredSettingKeyType;
  value: string;
  type: StoredSettingTypeType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

@Table({
  tableName: "stored_settings",
  modelName: "StoredSetting",
  timestamps: true,
  paranoid: true,
})
class StoredSetting
  extends Model<
    StoredSettingAttributes,
    Optional<StoredSettingAttributes, "id">
  >
  implements StoredSettingAttributes
{
  id!: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isIn: [storedSettingKeys] },
  })
  key!: StoredSettingKeyType;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  value!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [storedSettingTypes] },
  })
  type!: StoredSettingTypeType;
}

export default StoredSetting;
