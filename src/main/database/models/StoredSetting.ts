/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: product.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { Table, Model, Column } from 'sequelize-typescript';

@Table({
  tableName: 'stored_settings',
  modelName: 'StoredSetting',
  timestamps: true,
  paranoid: true,
})
class StoredSetting extends Model {
  @Column
  key!: string;

  @Column
  value!: string;
}

export default StoredSetting;
