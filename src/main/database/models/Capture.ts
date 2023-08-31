/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Capture.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes} from 'sequelize'
import {Table, Model, Column, ForeignKey, BelongsTo} from 'sequelize-typescript'
import {Schedule} from '..'

@Table({
  tableName: 'captures',
  modelName: 'Capture',
  timestamps: true,
  paranoid: true,
  })
class Capture extends Model {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  downloadLocation!: string

  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 3,
  })
  allowedRetriesCount!: number

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  deletedFromDownloads!: boolean

  @ForeignKey(() => Schedule)
  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
  })
  scheduleId: number | undefined

  @BelongsTo(() => Schedule)
  schedule: Schedule | undefined
}

export default Capture
