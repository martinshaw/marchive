/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: setMarchiveIsSetup.ts
Created:  2023-08-01T20:25:00.481Z
Modified: 2023-08-01T20:25:00.481Z

Description: description
*/

const setMarchiveIsSetup = async (
  newValue: boolean | null = null,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'stored-settings.set',
      (setMarchiveIsSetupValue) => {
        if (typeof setMarchiveIsSetupValue !== 'boolean') return reject();
        resolve(setMarchiveIsSetupValue);
      },
    );

    window.electron.ipcRenderer.sendMessage(
      'stored-settings.set',
      'MARCHIVE_IS_SETUP',
      newValue,
    );
  });
};

export default setMarchiveIsSetup;
