/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: list.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { Attributes } from 'sequelize'
import {Capture, Schedule} from '../../../database'

const CaptureListAction = async (): Promise<Attributes<Capture>[]> => {
  return Capture
    .findAll({
      include: [Schedule],
    })
    .then(captures =>
      captures.map(capture => capture.toJSON())
    )
}

export default CaptureListAction
