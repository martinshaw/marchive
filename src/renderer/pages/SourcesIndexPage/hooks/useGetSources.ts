/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useGetSources.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useEffect, useState } from 'react';
import { Source } from '../../../../main/database';

const useGetSources = () => {
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('sources.get-sources', (sourcesValue) => {
      if (sourcesValue == null) return;

      setSources(sourcesValue as Source[]);
    });

    window.electron.ipcRenderer.sendMessage('sources.get-sources');
  }, []);

  return sources;
};

export default useGetSources;
