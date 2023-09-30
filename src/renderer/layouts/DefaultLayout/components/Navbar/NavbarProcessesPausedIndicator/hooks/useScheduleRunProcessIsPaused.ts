/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useScheduleRunProcessIsPaused.ts
Created:  2023-09-30T05:33:02.371Z
Modified: 2023-09-30T05:33:02.371Z

Description: description
*/

import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

type UseScheduleRunProcessIsPausedReturnType = boolean | null;

const useScheduleRunProcessIsPaused: () => UseScheduleRunProcessIsPausedReturnType =
  () => {
    const [scheduleRunProcessIsPaused, setScheduleRunProcessIsPaused] =
      useState<boolean | null>(null);

    useEffect(() => {
      const removeListener = window.electron.ipcRenderer.on(
        'utilities.schedule-run-process-is-paused',
        (value, error) => {
          if (error != null) return;
          setScheduleRunProcessIsPaused(value as boolean);
        }
      );

      window.electron.ipcRenderer.sendMessage(
        'utilities.schedule-run-process-is-paused',
        null
      );

      return () => removeListener();
    }, []);

    return scheduleRunProcessIsPaused;
  };

export default useScheduleRunProcessIsPaused;
