/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { Schedule, Source, WhereOptions } from 'database'
import { SourceAttributes } from 'database/src/models/Source'

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
