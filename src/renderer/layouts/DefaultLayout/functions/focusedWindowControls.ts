/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: focusedWindowControls.ts
Created:  2023-09-12T15:48:35.947Z
Modified: 2023-09-12T15:48:35.947Z

Description: description
*/

const toggleMaximize = () => {
  return new Promise<void>((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('utilities.focused-window.toggle-maximise');
    resolve();
  });
}

export {
  toggleMaximize
}
