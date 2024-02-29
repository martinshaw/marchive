/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureFiles.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { CaptureEntityType, CapturePartEntityType } from 'common-types';
import { useAsyncMemo } from 'use-async-memo';

const useCaptureFiles: (
  capture: CaptureEntityType,
  capturePart: CapturePartEntityType | null,
  filter: 'image' | 'video' | 'audio' | 'json' | 'directory ' | undefined,
) => {
  name: string;
}[] = (capture, capturePart = null, filter = undefined) =>
  useAsyncMemo<{ name: string }[]>(
    () =>
      new Promise((resolve, reject) => {
        const channelName =
          capturePart != null
            ? 'capture-parts.show-files'
            : 'captures.show-files';
        const id = capturePart != null ? capturePart.id : capture.id;

        window.electron.ipcRenderer.once(channelName, (files, error) => {
          if (error != null) return reject(error as Error);
          resolve(files as { name: string }[]);
        });

        window.electron.ipcRenderer.sendMessage(channelName, id, filter);
      }),
    [capture, capturePart],
    [],
  );

export default useCaptureFiles;
