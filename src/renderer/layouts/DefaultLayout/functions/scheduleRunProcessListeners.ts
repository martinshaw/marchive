/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: scheduleRunProcessListeners.ts
Created:  2023-09-06T18:28:58.314Z
Modified: 2023-09-06T18:28:58.314Z

Description: description
*/

import { ProcessStartProcessConnectionInfoReturnType, ProcessesReplyOngoingEventDataType } from "../../../../main/app/actions/Process/ProcessStartProcess";
import processListeners from "./processListeners";

const scheduleRunProcessListeners = (
  onConnected: (connectionInfo: ProcessStartProcessConnectionInfoReturnType) => void,
  onOngoingEvent: (ongoingEvent: ProcessesReplyOngoingEventDataType) => void,
  onConnectionError: (errorMessage: string) => void,
): {
  removeListeners: () => void;
} => {
  return processListeners(
    'processes.schedule-run-process.connected',
    'processes.schedule-run-process.ongoing-event',
    'processes.schedule-run-process.connection-error',
    onConnected,
    onOngoingEvent,
    onConnectionError,
  )
};

export default scheduleRunProcessListeners;
