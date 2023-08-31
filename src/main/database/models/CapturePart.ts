/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePart.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes} from 'sequelize'
import {Table, Model, Column, ForeignKey, BelongsTo} from 'sequelize-typescript'
import {Capture, Schedule} from '..'

const capturePartStatuses = ['pending', 'processing', 'completed', 'failed'] as const
export type CapturePartStatus = typeof capturePartStatuses[number]

@Table({
  tableName: 'capture_parts',
  modelName: 'CapturePart',
  timestamps: true,
  paranoid: true,
  })
class CapturePart extends Model {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending' as CapturePartStatus,
    validate: {isIn: [capturePartStatuses]},
  })
  status!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  url!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  dataProviderPartIdentifier!: string

  @Column({
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: '{}',
  })
  payload!: string

  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  })
  currentRetryCount!: number

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  deletedFromDownloads!: boolean

  @ForeignKey(() => Capture)
  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
  })
  captureId: number | undefined

  @BelongsTo(() => Capture)
  capture: Capture | undefined
}

export default CapturePart
