/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { Op } from 'database'
import { Capture, Schedule } from 'database'
import { ScheduleAttributes } from 'database/src/models/Schedule'

const ScheduleListAction = async (sourceId: number | null = null, withCaptures = false): Promise<ScheduleAttributes[]> => {
  let where = {}
  if (sourceId != null) where = { ...where, sourceId: {[Op.eq]: sourceId} }

  let include: any[] = []
  if (withCaptures) include = [...include, Capture]

  return Schedule
    .findAll({
      include,
      where,
    })
    .then(schedules =>
      schedules.map(schedule => schedule.toJSON())
    )
}

export default ScheduleListAction
