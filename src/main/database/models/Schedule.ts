/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Schedule.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes} from 'sequelize'
import {Table, Model, Column, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript'
import {Source, Capture} from '..'

const scheduleStatuses = ['pending', 'processing'] as const
export type ScheduleStatus = typeof scheduleStatuses[number]

@Table({
  tableName: 'schedules',
  modelName: 'Schedule',
  timestamps: true,
  paranoid: true,
  })
class Schedule extends Model {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {isIn: [scheduleStatuses]},
  })
  status!: ScheduleStatus

  @Column({
    type: DataTypes.NUMBER,
    allowNull: true,
    defaultValue: 60 * 15, // fifteen minutes
  })
  interval!: number | null

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  lastRunAt!: Date | null

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  })
  nextRunAt!: Date | null

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  downloadLocation!: string

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  enabled!: boolean

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  deletedFromDownloads!: boolean

  @ForeignKey(() => Source)
  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
  })
  sourceId!: number | undefined

  @BelongsTo(() => Source)
  source!: Source | undefined

  @HasMany(() => Capture)
  captures!: Array<Capture>
}

export default Schedule
