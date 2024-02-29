/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartShowFilesAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import runImmediateCliCommandUsingIpcPool from '../../cli/runImmediateCliCommandUsingIpcPool';

const CapturePartShowFilesAction = async (
  capturePartId: number,
  filter?: 'image' | 'video' | 'audio' | 'json' | 'directory',
): Promise<{ name: string }[]> =>
  runImmediateCliCommandUsingIpcPool<{ name: string }>(
    'capture-part:show-files',
    [
      capturePartId,
      {
        ...(typeof filter === 'undefined' ? {} : { filter }),
      },
    ],
  ).then((response) => response.getData());

export default CapturePartShowFilesAction;
