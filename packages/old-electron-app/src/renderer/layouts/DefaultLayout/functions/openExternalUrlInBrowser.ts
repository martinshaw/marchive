/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: openExternalUrlInBrowser.ts
Created:  2023-09-12T04:34:10.808Z
Modified: 2023-09-12T04:34:10.808Z

Description: description
*/

const openExternalUrlInBrowser = async (url: string | null | undefined): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (url == null) return resolve();
    window.electron.ipcRenderer.sendMessage('utilities.open-external-url-in-browser', url);
    return resolve()
  });
};

export default openExternalUrlInBrowser;
