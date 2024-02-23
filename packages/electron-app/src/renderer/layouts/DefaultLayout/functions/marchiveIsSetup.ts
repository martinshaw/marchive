/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: marchiveIsSetup.ts
Created:  2023-08-01T20:25:00.481Z
Modified: 2023-08-01T20:25:00.481Z

Description: description
*/

const marchiveIsSetup = async (newValue: boolean | null = null): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.once(
      'utilities.marchive-is-setup',
      (marchiveIsSetupValue) => {
        if (typeof marchiveIsSetupValue !== 'boolean') return reject();
        resolve(marchiveIsSetupValue);
      }
    );

    window.electron.ipcRenderer.sendMessage('utilities.marchive-is-setup', newValue);
  });
};

export default marchiveIsSetup;
