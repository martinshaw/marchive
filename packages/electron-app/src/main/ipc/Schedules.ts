/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: schedules.ts
Created:  2023-08-31T03:34:18.209Z
Modified: 2023-08-31T03:34:18.209Z

Description: description
*/

import { ipcMain } from 'electron';

import ScheduleListAction from '../app/actions/Schedule/ScheduleListAction';
import ScheduleShowAction from '../app/actions/Schedule/ScheduleShowAction';
import ScheduleCreateAction from '../app/actions/Schedule/ScheduleCreateAction';
import ScheduleUpdateAction from '../app/actions/Schedule/ScheduleUpdateAction';
import ScheduleDeleteAction from '../app/actions/Schedule/ScheduleDeleteAction';

export type SchedulesChannels =
  | 'schedules.list'
  | 'schedules.show'
  | 'schedules.create'
  | 'schedules.update'
  | 'schedules.delete';

ipcMain.on(
  'schedules.list',
  async (event, sourceId, withSource, withCaptures) => {
    return ScheduleListAction(sourceId, withSource, withCaptures)
      .then((schedules) => {
        event.reply('schedules.list', schedules, null);
      })
      .catch((error) => {
        event.reply('schedules.list', null, error);
      });
  },
);

ipcMain.on(
  'schedules.show',
  async (event, scheduleId, withSource, withCaptures) => {
    return ScheduleShowAction(scheduleId, withSource, withCaptures)
      .then((schedule) => {
        event.reply('schedules.show', schedule, null);
      })
      .catch((error) => {
        event.reply('schedules.show', null, error);
      });
  },
);

ipcMain.on(
  'schedules.create',
  async (
    event,
    sourceId: number,
    intervalInSeconds: number | null = null,
    downloadLocation: string | null = null,
  ) => {
    return ScheduleCreateAction(sourceId, intervalInSeconds, downloadLocation)
      .then((schedule) => {
        event.reply('schedules.create', schedule, null);
      })
      .catch((error) => {
        event.reply('schedules.create', null, error);
      });
  },
);

ipcMain.on(
  'schedules.update',
  async (
    event,
    scheduleId: number,
    // TODO : Need to change this, I suspect that using null and not undefined will cause the interval to be updated to null instead of not being updated as desired
    intervalInSeconds: number | null = null,
    downloadLocation: string | null = null,
    enable: boolean | null = null,
    disable: boolean | null = null,
  ) => {
    return ScheduleUpdateAction(
      scheduleId,
      intervalInSeconds,
      downloadLocation,
      enable,
      disable,
    )
      .then((schedule) => {
        event.reply('schedules.update', schedule, null);
      })
      .catch((error) => {
        event.reply('schedules.update', null, error);
      });
  },
);

ipcMain.on('schedules.delete', async (event, scheduleId: number) => {
  return ScheduleDeleteAction(scheduleId)
    .then(() => {
      event.reply('schedules.delete', null, null);
    })
    .catch((error) => {
      event.reply('schedules.delete', null, error);
    });
});
