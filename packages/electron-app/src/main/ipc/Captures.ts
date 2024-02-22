/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: captures.ts
Created:  2023-08-31T03:42:51.446Z
Modified: 2023-08-31T03:42:51.446Z

Description: description
*/

import { ipcMain } from 'electron';

import CaptureListAction from '../app/actions/Capture/CaptureListAction';
import CaptureShowAction from '../app/actions/Capture/CaptureShowAction';
import CaptureDeleteAction from '../app/actions/Capture/CaptureDeleteAction';
import CapturePromptForDeletionAction from '../app/actions/Capture/CapturePromptForDeletionAction';

export type CapturesChannels =
  | 'captures.list'
  | 'captures.show'
  | 'captures.delete'
  | 'captures.prompt-for-deletion';

ipcMain.on('captures.list', async (event) => {
  return CaptureListAction()
    .then((captures) => {
      event.reply('captures.list', captures, null);
    })
    .catch((error) => {
      event.reply('captures.list', null, error);
    });
});

ipcMain.on(
  'captures.show',
  async (
    event,
    captureId: number,
    withSchedule: boolean = false,
    withSource: boolean = false,
    withSourceDomain: boolean = false,
    withCaptureParts: boolean = false,
  ) => {
    return CaptureShowAction(
      captureId,
      withSchedule,
      withSource,
      withSourceDomain,
      withCaptureParts,
    )
      .then((capture) => {
        event.reply('captures.show', capture, null);
      })
      .catch((error) => {
        event.reply('captures.show', null, error);
      });
  },
);

ipcMain.on('captures.delete', async (event, captureId: number) => {
  return CaptureDeleteAction(captureId)
    .then((capture) => {
      event.reply('captures.delete', capture, null);
    })
    .catch((error) => {
      event.reply('captures.delete', null, error);
    });
});

ipcMain.on('captures.prompt-for-deletion', async (event, captureId: number) => {
  return CapturePromptForDeletionAction(captureId)
    .then((deleted) => {
      event.reply('captures.prompt-for-deletion', deleted, null);
    })
    .catch((error) => {
      event.reply('captures.prompt-for-deletion', null, error);
    });
});
