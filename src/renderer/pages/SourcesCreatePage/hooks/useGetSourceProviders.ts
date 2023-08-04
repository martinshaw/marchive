/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useGetSourceProviders.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { SourceProviderSerializedType } from 'main/providers/sources/SourceProvider';
import { useEffect, useState } from 'react';

const useGetSourceProviders = () => {
  const [sourceProviders, setSourceProviders] = useState<
    SourceProviderSerializedType[]
  >([]);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'sources.get-source-providers',
      (sourceProvidersSerializedValue) => {
        if (sourceProvidersSerializedValue == null) return;

        const sourceProvidersValue =
          sourceProvidersSerializedValue as typeof sourceProviders;

        setSourceProviders(sourceProvidersValue);
      }
    );

    window.electron.ipcRenderer.sendMessage('sources.get-source-providers');
  }, []);

  return sourceProviders;
};

export default useGetSourceProviders;
