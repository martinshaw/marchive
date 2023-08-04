/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { Table, Model, Column } from 'sequelize-typescript';

@Table({
  tableName: 'sources',
  modelName: 'Source',
  timestamps: true,
  paranoid: true,
})
class Source extends Model {
  @Column
  source_provider_identifier!: string;

  @Column
  url!: string;
}

export default Source;
