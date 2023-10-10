/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePart.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes, Optional} from 'sequelize'
import {Table, Model, Column, ForeignKey, BelongsTo} from 'sequelize-typescript'
import {Capture, Schedule} from '..'

const capturePartStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'] as const
export type CapturePartStatus = typeof capturePartStatuses[number]

export type CapturePartAttributes = {
  id: number
  status: CapturePartStatus
  url: string
  dataProviderPartIdentifier: string
  payload: string
  downloadLocation: string
  currentRetryCount: number
  deletedFromDownloads: boolean
  captureId: number | undefined
  capture: Capture | undefined
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

@Table({
  tableName: 'capture_parts',
  modelName: 'CapturePart',
  timestamps: true,
  paranoid: true,
  })
class CapturePart extends Model<
  CapturePartAttributes,
  Optional<
    CapturePartAttributes,
    'id' | 'capture' | 'status' | 'payload' | 'currentRetryCount' | 'deletedFromDownloads'
  >
> implements CapturePartAttributes {
  id!: number

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending' as CapturePartStatus,
    validate: {isIn: [capturePartStatuses]},
  })
  status!: CapturePartStatus

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
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  })
  downloadLocation!: string

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
