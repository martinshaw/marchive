/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: scheduleRunProcessEvents.ts
Created:  2023-09-06T18:28:58.314Z
Modified: 2023-09-06T18:28:58.314Z

Description: description
*/

import { ProcessesReplyOngoingEventDataType } from "../../../../main/ipc/Processes";
import { ProcessStartProcessConnectionInfoReturnType } from "../../../../main/app/actions/Process/ProcessStartProcess";

const scheduleRunProcessEvents = (
  onConnected: (connectionInfo: ProcessStartProcessConnectionInfoReturnType) => void,
  onConnectionError: (error: Error) => void,
  onOngoingEvent: (ongoingEvent: ProcessesReplyOngoingEventDataType) => void,
): {
  removeListeners: () => void;
} => {
  console.log('scheduleRunProcessEvents attach run')

  window.electron.ipcRenderer.on(
    'processes.schedule-run-process.connection-error',
    (error) => {
      console.log('processes.schedule-run-process.connection-error', error)
      if (!(error instanceof Error)) return null;
      onConnectionError(error);
    }
  );

  window.electron.ipcRenderer.on(
    'processes.schedule-run-process.ongoing-event',
    (ongoingEvent) => {
      console.log('processes.schedule-run-process.ongoing-event', ongoingEvent)
      onOngoingEvent(ongoingEvent as ProcessesReplyOngoingEventDataType);
    }
  );

  window.electron.ipcRenderer.on(
    'processes.schedule-run-process.connected',
    (connectionInfo) => {
      console.log('processes.schedule-run-process.connected', connectionInfo)
      onConnected(connectionInfo as ProcessStartProcessConnectionInfoReturnType);
    }
  );

  const removeListeners = (): void => {
    console.log('removeListeners')
    window.electron.ipcRenderer.removeAllListeners('processes.schedule-run-process.connection-error');
    window.electron.ipcRenderer.removeAllListeners('processes.schedule-run-process.ongoing-event');
    window.electron.ipcRenderer.removeAllListeners('processes.schedule-run-process.connected');
  }

  window.electron.ipcRenderer.sendMessage('processes.schedule-run-process.start');

  return {removeListeners};
};

export default scheduleRunProcessEvents;
