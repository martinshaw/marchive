/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: list.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { SourceAttributes } from 'main/database/models/Source'
import {Schedule, Source} from '../../../database'

const SourceListAction = async (): Promise<SourceAttributes[]> => {
  return Source
    .findAll({
      include: [Schedule],
    })
    .then(sources =>
      sources.map(source => source.toJSON())
    )
}

export default SourceListAction
