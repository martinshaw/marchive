/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { DataTypes, Optional } from 'sequelize'
import { Table, Model, Column, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Schedule, SourceDomain } from '..'

const sourceUseStartOrEndCursorValues = ['start', 'end', null] as const
export type SourceUseStartOrEndCursorValueType = typeof sourceUseStartOrEndCursorValues[number] | null

export type SourceAttributes = {
  id: number
  dataProviderIdentifier: string
  url: string
  name: string | null
  currentStartCursorUrl: string | null
  currentEndCursorUrl: string | null
  useStartOrEndCursor: SourceUseStartOrEndCursorValueType
  schedules: Array<Schedule>
  sourceDomainId?: number | null
  sourceDomain?: SourceDomain
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

@Table({
  tableName: 'sources',
  modelName: 'Source',
  timestamps: true,
  paranoid: true,
  })
class Source extends Model<
  SourceAttributes,
  Optional<
    SourceAttributes,
    'id' |
    'name' |
    'schedules' |
    'useStartOrEndCursor' |
    'sourceDomainId' |
    'sourceDomain'
  >
> implements SourceAttributes {
  id!: number

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
    defaultValue: null,
  })
  name!: string

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

  @ForeignKey(() => SourceDomain)
  @Column({
    type: DataTypes.NUMBER,
    allowNull: true,
    defaultValue: null,
  })
  sourceDomainId!: number | null | undefined

  @BelongsTo(() => SourceDomain)
  sourceDomain!: SourceDomain | undefined
}

export default Source
