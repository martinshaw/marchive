/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: list.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { Attributes } from 'sequelize'
import {Schedule, Source} from '../../../database'

const ScheduleListAction = async (): Promise<Attributes<Schedule>[]> => {
  return Schedule
    .findAll({
      include: [Source],
    })
    .then(schedules =>
      schedules.map(schedule => schedule.toJSON())
    )
}

export default ScheduleListAction
