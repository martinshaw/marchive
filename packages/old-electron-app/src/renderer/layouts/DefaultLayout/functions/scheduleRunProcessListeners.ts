/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: scheduleRunProcessListeners.ts
Created:  2023-09-06T18:28:58.314Z
Modified: 2023-09-06T18:28:58.314Z

Description: description
*/

import processListeners from "./processListeners";
import { ProcessStartProcessActionConnectionInfoReturnType, ProcessesReplyOngoingEventDataType } from "../../../../main/app/actions/Process/ProcessStartProcessAction";

const scheduleRunProcessListeners = (
  onConnected: (connectionInfo: ProcessStartProcessActionConnectionInfoReturnType) => void,
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
