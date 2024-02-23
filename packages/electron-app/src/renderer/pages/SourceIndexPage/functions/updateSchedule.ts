/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: updateSchedule.ts
Created:  2023-10-02T14:52:01.459Z
Modified: 2023-10-02T14:52:01.459Z

Description: description
*/

import { ScheduleEntityType } from 'common-types';

const updateSchedule = async (
  schedule: ScheduleEntityType,
  changes: Partial<ScheduleEntityType>,
) => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'schedules.update',
      (updatedSchedule, error) => {
        if (error != null) return reject(error);

        resolve(updatedSchedule as ScheduleEntityType);
      },
    );

    window.electron.ipcRenderer.sendMessage(
      'schedules.update',
      schedule.id,
      // TODO : Need to change this, I suspect that using null and not undefined will cause the interval to be updated to null instead of not being updated as desired
      //   Might not be a problem if the interval is being "updated" to the present value
      changes.interval,
      changes.downloadLocation,
      // false,
      // false,
    );
  });
};

export default updateSchedule;
