/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: list.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import {Schedule, Source} from '../../../database'
import { ScheduleAttributes } from 'main/database/models/Schedule'

const ScheduleListAction = async (): Promise<ScheduleAttributes[]> => {
  return Schedule
    .findAll({
      include: [Source],
    })
    .then(schedules =>
      schedules.map(schedule => schedule.toJSON())
    )
}

export default ScheduleListAction
