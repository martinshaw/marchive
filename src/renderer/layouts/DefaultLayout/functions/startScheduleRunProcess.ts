/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: startScheduleRunProcess.ts
Created:  2023-09-06T18:28:58.314Z
Modified: 2023-09-06T18:28:58.314Z

Description: description
*/

import { ProcessesReplyOngoingEventDataType } from "../../../../main/ipc/Processes";
import { ProcessStartProcessConnectionInfoReturnType } from "../../../../main/app/actions/Process/ProcessStartProcess";

const startScheduleRunProcess = async (
  onOngoingEvent: (ongoingEvent: ProcessesReplyOngoingEventDataType) => void,
): Promise<ProcessStartProcessConnectionInfoReturnType | null> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.on(
      'processes.start-schedule-run-process',
      (...args) => {
        console.log('123 before args')

        const [ connectionInfo, error, ongoingEvent ] = args as [
          connectionInfo: ProcessStartProcessConnectionInfoReturnType | null,
          error: Error | null,
          ongoingEvent: ProcessesReplyOngoingEventDataType | null,
        ]

        console.log('123 before error')
        if (error != null) return reject(error);

        console.log('123 before ongoingEvent')
        if (ongoingEvent != null) {
          console.log('123 -> ongoingEvent')
          onOngoingEvent(ongoingEvent);
          return null;
        }

        console.log('123 before resolve')
        return resolve(connectionInfo);
      }
    );

    console.log('123 before sendMessage')

    window.electron.ipcRenderer.sendMessage('processes.start-schedule-run-process');
  });
};

export default startScheduleRunProcess;
