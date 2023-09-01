/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useMarchiveIsSetup.ts
Created:  2023-08-01T20:25:00.481Z
Modified: 2023-08-01T20:25:00.481Z

Description: description
*/

import { useEffect, useState } from 'react';

const useMarchiveIsSetup = () => {
  const [marchiveIsSetup, setMarchiveIsSetup] = useState(true);

  useEffect(() => {
    window.electron.ipcRenderer.once(
      'utilities.marchive-is-setup',
      (marchiveIsSetupValue) => {
        if (typeof marchiveIsSetupValue !== 'boolean') return;

        setMarchiveIsSetup(marchiveIsSetupValue);
      }
    );

    window.electron.ipcRenderer.sendMessage('utilities.marchive-is-setup');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('utilities.marchive-is-setup');
    };
  }, []);

  return marchiveIsSetup;
};

export default useMarchiveIsSetup;
