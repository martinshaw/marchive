/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useIsDarkMode.ts
Created:  2023-08-01T20:25:00.481Z
Modified: 2023-08-01T20:25:00.481Z

Description: description
*/

import { useEffect, useState } from 'react';

const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'utilities.is-dark-mode',
      (isDarkModeValue) => {
        if (typeof isDarkModeValue !== 'boolean') return;

        setIsDarkMode(isDarkModeValue);
      }
    );

    window.electron.ipcRenderer.sendMessage('utilities.is-dark-mode');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('utilities.is-dark-mode');
    };
  }, []);

  return isDarkMode;
};

export default useIsDarkMode;
