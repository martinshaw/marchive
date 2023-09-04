/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import {DataTypes, Optional} from 'sequelize'
import {Table, Model, Column, HasMany} from 'sequelize-typescript'
import { Schedule, Source } from '..'

const sourceUseStartOrEndCursorValues = ['start', 'end', null] as const
export type SourceUseStartOrEndCursorValueType = typeof sourceUseStartOrEndCursorValues[number] | null

export type SourceDomainAttributes = {
  id: number
  name: string
  faviconPath: string
  sources: Array<Source>
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

/**
 * A source domain is the website or domain which a source's URL belongs to.
 *
 * So if a Source's URL is https://www.example.com/ then the many-to-one
 *   associated Source Domain has the name 'example.com' and a path to
 *   example.com's favicon.
 *
 * As well as being visually helpful in the UI, this allows us to
 *   group sources by domain.
 */
@Table({
  tableName: 'source_domains',
  modelName: 'SourceDomain',
  timestamps: true,
  paranoid: true,
  })
class SourceDomain extends Model<
  SourceDomainAttributes,
  Optional<
    SourceDomainAttributes,
    'id' | 'sources'
  >
> implements SourceDomainAttributes {
  id!: number

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  faviconPath!: string

  @HasMany(() => Source)
  sources!: Array<Source>
}

export default SourceDomain
