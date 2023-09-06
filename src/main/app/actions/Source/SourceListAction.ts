/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { SourceAttributes } from '../../../database/models/Source'
import {Schedule, Source} from '../../../database'
import { WhereOptions } from 'sequelize'

const SourceListAction = async (where: WhereOptions<SourceAttributes> | undefined = undefined): Promise<SourceAttributes[]> => {
  return Source
    .findAll({
      where,
      include: [Schedule],
    })
    .then(sources =>
      sources.map(source => source.toJSON())
    )
}

export default SourceListAction
