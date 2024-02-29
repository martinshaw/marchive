/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: capture-parts.ts
Created:  2023-08-31T03:42:51.446Z
Modified: 2023-08-31T03:42:51.446Z

Description: description
*/

import { ipcMain } from 'electron';

import CapturePartListAction from '../app/actions/CapturePart/CapturePartListAction';
import CapturePartShowAction from '../app/actions/CapturePart/CapturePartShowAction';
import CapturePartShowFilesAction from '../app/actions/CapturePart/CapturePartShowFilesAction';
import CapturePartDeleteAction from '../app/actions/CapturePart/CapturePartDeleteAction';
import CapturePartPromptForDeletionAction from '../app/actions/CapturePart/CapturePartPromptForDeletionAction';

export type CapturePartsChannels =
  | 'capture-parts.list'
  | 'capture-parts.show'
  | 'capture-parts.show-files'
  | 'capture-parts.delete'
  | 'capture-parts.prompt-for-deletion';

ipcMain.on('capture-parts.list', async (event) => {
  return CapturePartListAction()
    .then((captureParts) => {
      event.reply('capture-parts.list', captureParts, null);
    })
    .catch((error) => {
      event.reply('capture-parts.list', null, error);
    });
});

ipcMain.on(
  'capture-parts.show',
  async (event, capturePartId: number, withCapture: boolean = false) => {
    return CapturePartShowAction(capturePartId, withCapture)
      .then((capturePart) => {
        event.reply('capture-parts.show', capturePart, null);
      })
      .catch((error) => {
        event.reply('capture-parts.show', null, error);
      });
  },
);

ipcMain.on(
  'capture-parts.show-files',
  async (
    event,
    capturePartId: number,
    filter?: 'image' | 'video' | 'audio' | 'json' | 'directory',
  ) => {
    return CapturePartShowFilesAction(capturePartId, filter)
      .then((files) => {
        event.reply('capture-parts.show-files', files, null);
      })
      .catch((error) => {
        event.reply('capture-parts.show-files', null, error);
      });
  },
);

ipcMain.on(
  'capture-parts.delete',
  async (event, capturePartId: number, alsoDeleteFiles: boolean = false) => {
    return CapturePartDeleteAction(capturePartId, alsoDeleteFiles)
      .then(() => {
        event.reply('capture-parts.delete', true, null);
      })
      .catch((error) => {
        event.reply('capture-parts.delete', null, error);
      });
  },
);

ipcMain.on(
  'capture-parts.prompt-for-deletion',
  async (event, capturePartId: number) => {
    return CapturePartPromptForDeletionAction(capturePartId)
      .then((deleted) => {
        event.reply('capture-parts.prompt-for-deletion', deleted, null);
      })
      .catch((error) => {
        event.reply('capture-parts.prompt-for-deletion', null, error);
      });
  },
);
