/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: captures.ts
Created:  2023-08-31T03:42:51.446Z
Modified: 2023-08-31T03:42:51.446Z

Description: description
*/

import { ipcMain } from "electron";
import CaptureListAction from "../app/actions/Capture/CaptureListAction";
import CaptureShowAction from "../app/actions/Capture/CaptureShowAction";
import CaptureRunAction from "../app/actions/Capture/CaptureRunAction";

export type CapturesChannels =
  | 'captures.list'
  | 'captures.show'
  | 'captures.run'

ipcMain.on('captures.list', async (event) => {
  return CaptureListAction()
    .then(captures => { event.reply('captures.list', captures, null) })
    .catch(error => { event.reply('captures.list', null, error) })
})

ipcMain.on('captures.show', async (
  event,
  captureId: number | null = null,
  withSchedule: boolean = false,
  withSource: boolean = false,
  withSourceDomain: boolean = false,
  withCaptureParts: boolean = false,
) => {
  return CaptureShowAction(captureId, withSchedule, withSource, withSourceDomain, withCaptureParts)
    .then(capture => { event.reply('captures.show', capture, null) })
    .catch(error => { event.reply('captures.show', null, error) })
})

ipcMain.on('captures.run', async (event, scheduleId: number) => {
  return CaptureRunAction(scheduleId)
    .then(() => { event.reply('captures.run', null, null) })
    .catch(error => { event.reply('captures.run', null, error) })
})
