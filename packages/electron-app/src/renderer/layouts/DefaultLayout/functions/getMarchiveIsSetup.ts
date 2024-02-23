/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getMarchiveIsSetup.ts
Created:  2023-08-01T20:25:00.481Z
Modified: 2023-08-01T20:25:00.481Z

Description: description
*/

const getMarchiveIsSetup = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'stored-settings.get',
      (getMarchiveIsSetupValue) => {
        resolve(
          typeof getMarchiveIsSetupValue !== 'boolean'
            ? false
            : getMarchiveIsSetupValue,
        );
      },
    );

    window.electron.ipcRenderer.sendMessage(
      'stored-settings.get',
      'MARCHIVE_IS_SETUP',
    );
  });
};

export default getMarchiveIsSetup;
