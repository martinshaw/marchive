/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: capturePartRunProcessListeners.ts
Created:  2023-09-06T18:28:58.314Z
Modified: 2023-09-06T18:28:58.314Z

Description: description
*/

import processListeners from "./processListeners";
import { ProcessStartProcessActionConnectionInfoReturnType, ProcessesReplyOngoingEventDataType } from "../../../../main/app/actions/Process/ProcessStartProcessAction";

const capturePartRunProcessListeners = (
  onConnected: (connectionInfo: ProcessStartProcessActionConnectionInfoReturnType) => void,
  onOngoingEvent: (ongoingEvent: ProcessesReplyOngoingEventDataType) => void,
  onConnectionError: (errorMessage: string) => void,
): {
  removeListeners: () => void;
} => {
  return processListeners(
    'processes.capture-part-run-process.connected',
    'processes.capture-part-run-process.ongoing-event',
    'processes.capture-part-run-process.connection-error',
    onConnected,
    onOngoingEvent,
    onConnectionError,
  )
};

export default capturePartRunProcessListeners;
