/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: promptForCaptureDeletion.ts
Created:  2023-09-19T22:43:35.375Z
Modified: 2023-09-19T22:43:35.375Z

Description: description
*/

import { Capture } from "database";
import { CaptureAttributes } from "database/src/models/Capture";

const promptForCaptureDeletion = async (capture: Capture | CaptureAttributes): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    if (capture == null) return resolve(false);

    window.electron.ipcRenderer.once(
      'captures.prompt-for-deletion',
      (deleted, error) => {
        if (error !== null) return reject(error);
        if (typeof deleted !== 'boolean') return reject();
        resolve(deleted);
      }
    );

    window.electron.ipcRenderer.sendMessage('captures.prompt-for-deletion', capture.id);
  });
};

export default promptForCaptureDeletion;
