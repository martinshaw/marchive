/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: promptForSourceDeletion.ts
Created:  2023-09-19T22:43:35.375Z
Modified: 2023-09-19T22:43:35.375Z

Description: description
*/

import { Source } from "../../../../main/database";

const promptForSourceDeletion = async (source: Source): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    if (source == null) return resolve(false);

    window.electron.ipcRenderer.once(
      'sources.prompt-for-deletion',
      (deleted, error) => {
        if (error !== null) return reject(error);
        if (typeof deleted !== 'boolean') return reject();
        resolve(deleted);
      }
    );

    window.electron.ipcRenderer.sendMessage('sources.prompt-for-deletion', source.id);
  });
};

export default promptForSourceDeletion;
