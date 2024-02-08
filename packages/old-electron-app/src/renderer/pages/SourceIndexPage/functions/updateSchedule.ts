/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: updateSchedule.ts
Created:  2023-10-02T14:52:01.459Z
Modified: 2023-10-02T14:52:01.459Z

Description: description
*/

import { Schedule } from "database";
import { ScheduleAttributes } from "database/src/models/Schedule";

const updateSchedule = async (schedule: Schedule | ScheduleAttributes, changes: Partial<ScheduleAttributes>) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'schedules.update',
      (updatedSchedule, error) => {
        if (error != null) return reject(error);

        resolve(updatedSchedule as ScheduleAttributes);
      }
    );

    window.electron.ipcRenderer.sendMessage('schedules.update', schedule.id, changes);
  })
}

export default updateSchedule;
