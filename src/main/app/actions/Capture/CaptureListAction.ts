/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import {Capture, Schedule} from '../../../database'
import { CaptureAttributes } from '../../../database/models/Capture'

const CaptureListAction = async (): Promise<CaptureAttributes[]> => {
  return Capture
    .findAll({
      include: [Schedule],
    })
    .then(captures =>
      captures.map(capture => capture.toJSON())
    )
}

export default CaptureListAction
