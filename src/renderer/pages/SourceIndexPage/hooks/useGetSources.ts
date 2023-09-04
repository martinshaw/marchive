/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useGetSources.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useEffect, useState } from 'react';
import { SourceAttributes } from 'main/database/models/Source';

/**
 * @deprecated Use `getSources` async method instead
 */
const useGetSources = () => {
  const [sources, setSources] = useState<SourceAttributes[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | false>(false);

  useEffect(() => {
    window.electron.ipcRenderer.once('sources.list', (sources, error) => {
      if (error != null) {
        setSources([])
        setErrorMessage((error as Error).message);
        return;
      }

      setSources(sources as SourceAttributes[]);
      setErrorMessage(false);
    });

    window.electron.ipcRenderer.sendMessage('sources.list');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('sources.list');
    };
  }, []);

  return {
    sources,
    errorMessage,
  };
};

export default useGetSources;
