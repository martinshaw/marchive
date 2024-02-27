/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getCapture.ts
Created:  2023-09-11T12:35:33.900Z
Modified: 2023-09-11T12:35:33.900Z

Description: description
*/

import { CaptureEntityType } from 'common-types';

/**
 * @throws {string}
 */
const getCapture = async (
  captureId: number | null = null,
  withSchedule: boolean = false,
  withSource: boolean = false,
  withSourceDomain: boolean = false,
  withCaptureParts: boolean = false,
): Promise<CaptureEntityType> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once('captures.show', (source, error) => {
      if (error != null) return reject(error as Error);

      resolve(source as CaptureEntityType);
    });

    window.electron.ipcRenderer.sendMessage(
      'captures.show',
      captureId,
      withSchedule,
      withSource,
      withSourceDomain,
      withCaptureParts,
    );
  });
};

export default getCapture;
