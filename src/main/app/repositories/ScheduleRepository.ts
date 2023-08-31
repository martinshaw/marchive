/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleRepository.ts
Created:  2023-08-25T16:47:42.472Z
Modified: 2023-08-25T16:47:42.472Z

Description: description
*/

import {Op} from 'sequelize'
import {Schedule, Source} from '../../database'
import {ScheduleStatus} from '../../database/models/Schedule'

export const retrieveDueSchedules = async (): Promise<Schedule[]> => {
  const dueSchedules = await Schedule.findAll(
    {
      where: {
        enabled: true,
        status: {
          [Op.eq]: 'pending' as ScheduleStatus,
        },
        nextRunAt: {
          [Op.lte]: new Date().toISOString(),
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Source,
        }
      ],
    },
  )

  return dueSchedules
}
