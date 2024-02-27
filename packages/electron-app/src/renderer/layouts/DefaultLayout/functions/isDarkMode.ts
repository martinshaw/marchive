/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: isDarkMode.ts
Created:  2023-09-01T05:43:18.889Z
Modified: 2023-09-01T05:43:18.889Z

Description: description
*/

const isDarkMode = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'utilities.is-dark-mode',
      (isDarkModeValue) => {
        return resolve(
          typeof isDarkModeValue === 'boolean' ? isDarkModeValue : false,
        );
      },
    );

    window.electron.ipcRenderer.sendMessage('utilities.is-dark-mode');
  });
};

export default isDarkMode;
