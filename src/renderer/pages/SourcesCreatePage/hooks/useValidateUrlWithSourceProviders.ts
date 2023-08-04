/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useValidateUrlWithSourceProviders.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

const useValidateUrlWithSourceProviders = (urlValue: string) => {
  const debouncedUrlValue = useDebounce(urlValue, 700);

  const [validSourceProviderIdentifiers, setValidSourceProviderIdentifiers] =
    useState<string[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'sources.validate-url-with-source-providers',
      (validSourceProviderIdentifiersValue) => {
        if (validSourceProviderIdentifiersValue == null) return;

        setValidSourceProviderIdentifiers(
          validSourceProviderIdentifiersValue as string[]
        );
      }
    );

    window.electron.ipcRenderer.sendMessage(
      'sources.validate-url-with-source-providers',
      debouncedUrlValue
    );
  }, [debouncedUrlValue]);

  return validSourceProviderIdentifiers;
};

export default useValidateUrlWithSourceProviders;
