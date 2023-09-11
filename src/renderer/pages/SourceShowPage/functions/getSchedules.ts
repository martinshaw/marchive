/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getSchedules.ts
Created:  2023-09-11T12:35:33.900Z
Modified: 2023-09-11T12:35:33.900Z

Description: description
*/
import { ScheduleAttributes } from "../../../../main/database/models/Schedule";

/**
 * @throws {string}
 */
const getSchedules = async (sourceId: number | null = null, withCaptures = false): Promise<ScheduleAttributes[]> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'schedules.list',
      (schedules, error) => {
        if (error != null) return reject(error);

        resolve(schedules as ScheduleAttributes[]);
      }
    );

    window.electron.ipcRenderer.sendMessage('schedules.list', sourceId, withCaptures);
  })
}

export default getSchedules;
