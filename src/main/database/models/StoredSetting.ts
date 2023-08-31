/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: StoredSetting.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes} from 'sequelize'
import {Table, Model, Column} from 'sequelize-typescript'

const storedSettingTypes = ['string', 'number', 'boolean'] as const
export type StoredSettingTypeType = typeof storedSettingTypes[number]

@Table({
  tableName: 'stored_settings',
  modelName: 'StoredSetting',
  timestamps: true,
  paranoid: true,
  })
class StoredSetting extends Model {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  key!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  value!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {isIn: [storedSettingTypes]},
  })
  type!: StoredSettingTypeType
}

export default StoredSetting
