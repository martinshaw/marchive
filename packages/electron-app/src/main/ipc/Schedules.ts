/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: schedules.ts
Created:  2023-08-31T03:34:18.209Z
Modified: 2023-08-31T03:34:18.209Z

Description: description
*/

import { ipcMain } from 'electron'
import ScheduleCreateAction from '../app/actions/Schedule/ScheduleCreateAction'
import ScheduleDeleteAction from '../app/actions/Schedule/ScheduleDeleteAction'
import ScheduleListAction from '../app/actions/Schedule/ScheduleListAction'
import ScheduleUpdateAction from '../app/actions/Schedule/ScheduleUpdateAction'
import { ScheduleAttributes } from 'database/models/Schedule'

export type SchedulesChannels =
  | 'schedules.list'
  | 'schedules.create'
  | 'schedules.update'
  | 'schedules.delete'

ipcMain.on('schedules.list', async (event, sourceId, withCaptures) => {
  return ScheduleListAction(sourceId, withCaptures)
    .then(schedules => { event.reply('schedules.list', schedules, null) })
    .catch(error => { event.reply('schedules.list', null, error) })
})

ipcMain.on('schedules.create', async (event, sourceId: number, intervalInSeconds: number | null, downloadLocation: string | null = null) => {
  return ScheduleCreateAction(sourceId, intervalInSeconds, downloadLocation)
    .then(schedule => { event.reply('schedules.create', schedule, null) })
    .catch(error => { event.reply('schedules.create', null, error) })
})

ipcMain.on('schedules.update', async (event, scheduleId: number, requestedChanges: Partial<ScheduleAttributes>) => {
  return ScheduleUpdateAction(scheduleId, requestedChanges)
    .then(schedule => { event.reply('schedules.update', schedule, null) })
    .catch(error => { event.reply('schedules.update', null, error) })
})

ipcMain.on('schedules.delete', async (event, scheduleId: number) => {
  return ScheduleDeleteAction(scheduleId)
    .then(() => { event.reply('schedules.delete', null, null) })
    .catch(error => { event.reply('schedules.delete', null, error) })
})
