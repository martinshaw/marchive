/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourcePromptForDeletionAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { BrowserWindow, MessageBoxOptions, dialog } from "electron"
import { Schedule, Source } from "../../../database"
import logger from 'logger';"
import SourceDeleteAction from "./SourceDeleteAction"

/**
 * @throws {Error}
 */
const SourcePromptForDeletionAction = async (sourceId: number): Promise<boolean> => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  const messageBoxOptions: MessageBoxOptions = {
    type: 'warning',
    message: "Are you sure you want to delete this source of information?",
    detail: "You can remove the source from your Marchive without deleting all of the saved files from your computer.",
    buttons: ['Never Mind', 'Just Remove from Your Marchive', 'Remove from Your Marchive and Delete All Saved Files'],
    defaultId: 0,
    cancelId: 0,
  };

  return await (currentWindow == null ?
    dialog.showMessageBox(messageBoxOptions) :
    dialog.showMessageBox(currentWindow, messageBoxOptions)
  )
    .then(async (result) => {
      if (result.response === 1) {
        try { await SourceDeleteAction(sourceId, false) }
        catch (error) { return false; }
        return true;
      }
      if (result.response === 2) {
        try { await SourceDeleteAction(sourceId, true) }
        catch (error) { return false; }
        return true;
      }

      return true;
    })
    .catch((error) => {
      return false;
    });
}

export default SourcePromptForDeletionAction
