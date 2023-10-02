/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCapturePartRunProcessIsPaused.ts
Created:  2023-09-30T05:33:02.371Z
Modified: 2023-09-30T05:33:02.371Z

Description: description
*/

import { useCallback } from "react"
import { useEffect } from "react"
import { useState } from "react"

type UseCapturePartRunProcessIsPausedReturnType = boolean | null;

const useCapturePartRunProcessIsPaused: () => UseCapturePartRunProcessIsPausedReturnType =
  () => {
    const [capturePartRunProcessIsPaused, setCapturePartRunProcessIsPaused] =
      useState<boolean | null>(null);

    useEffect(() => {
      const removeListener = window.electron.ipcRenderer.on(
        'utilities.capture-part-run-process-is-paused',
        (value, error) => {
          if (error != null) return;
          setCapturePartRunProcessIsPaused(value as boolean);
        }
      );

      window.electron.ipcRenderer.sendMessage(
        'utilities.capture-part-run-process-is-paused',
        null
      );

      return () => removeListener();
    }, []);

    return capturePartRunProcessIsPaused;
  };

export default useCapturePartRunProcessIsPaused;
