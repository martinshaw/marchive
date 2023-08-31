/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes} from 'sequelize'
import {Table, Model, Column, HasMany} from 'sequelize-typescript'
import Schedule from './Schedule'

const sourceUseStartOrEndCursorValues = ['start', 'end', null] as const
export type SourceUseStartOrEndCursorValueType = typeof sourceUseStartOrEndCursorValues[number] | null

@Table({
  tableName: 'sources',
  modelName: 'Source',
  timestamps: true,
  paranoid: true,
  })
class Source extends Model {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  dataProviderIdentifier!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  url!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  currentStartCursorUrl!: string | null

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  currentEndCursorUrl!: string | null

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {isIn: [sourceUseStartOrEndCursorValues]},
  })
  useStartOrEndCursor!: SourceUseStartOrEndCursorValueType

  @HasMany(() => Schedule)
  schedules!: Array<Schedule>
}

export default Source
