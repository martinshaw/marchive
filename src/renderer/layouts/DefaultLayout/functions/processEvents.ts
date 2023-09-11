/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: processEvents.ts
Created:  2023-09-11T09:43:10.689Z
Modified: 2023-09-11T09:43:10.689Z

Description: description
*/

import { Channels } from "main/preload";
import { ProcessStartProcessConnectionInfoReturnType, ProcessesReplyOngoingEventDataType } from "../../../../main/app/actions/Process/ProcessStartProcess";

const processEvents = (
  processConnectedChannelName: Channels,
  processOngoingEventChannelName: Channels,
  processConnectionErrorChannelName: Channels,
  onConnected: (connectionInfo: ProcessStartProcessConnectionInfoReturnType) => void,
  onOngoingEvent: (ongoingEvent: ProcessesReplyOngoingEventDataType) => void,
  onConnectionError: (errorMessage: string) => void,
): {
  removeListeners: () => void;
} => {
  window.electron.ipcRenderer.on(
    processConnectedChannelName,
    (connectionInfo) => {
      onConnected(connectionInfo as ProcessStartProcessConnectionInfoReturnType);
    }
  );

  window.electron.ipcRenderer.on(
    processOngoingEventChannelName,
    (ongoingEvent) => {
      onOngoingEvent(ongoingEvent as ProcessesReplyOngoingEventDataType);
    }
  );

  window.electron.ipcRenderer.on(
    processConnectionErrorChannelName,
    (errorMessage) => {
      if (errorMessage == null || errorMessage == '') return null;
      onConnectionError(errorMessage as string);
    }
  );

  const removeListeners = (): void => {
    window.electron.ipcRenderer.removeAllListeners(processConnectionErrorChannelName);
    window.electron.ipcRenderer.removeAllListeners(processOngoingEventChannelName);
    window.electron.ipcRenderer.removeAllListeners(processConnectedChannelName);
  }

  return {removeListeners};
};

export default processEvents;
