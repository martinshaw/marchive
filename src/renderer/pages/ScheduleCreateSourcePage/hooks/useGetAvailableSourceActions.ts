/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useGetSourceActions.ts
Created:  2023-08-04T17:15:45.847Z
Modified: 2023-08-04T17:15:45.847Z

Description: description
*/

import { useEffect, useState } from 'react';

const useGetAvailableSourceActions = () => {
  const [availableSourceActions, setAvailableSourceActions] = useState<
    string[]
  >([]);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'sources.get-available-source-actions',
      (availableSourceActionsValue) => {
        if (availableSourceActionsValue == null) return;

        setAvailableSourceActions(
          availableSourceActionsValue as typeof availableSourceActions
        );
      }
    );

    window.electron.ipcRenderer.sendMessage(
      'sources.get-available-source-actions'
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        'sources.get-available-source-actions'
      );
    };
  }, []);

  return availableSourceActions;
};

export default useGetAvailableSourceActions;
