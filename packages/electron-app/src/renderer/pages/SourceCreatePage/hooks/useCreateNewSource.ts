/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCreateNewSource.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { SourceEntityType } from 'common-types';
import { useCallback, useState } from 'react';

const useCreateNewSource = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createdSource, setCreatedSource] = useState<SourceEntityType | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<Error | false>(false);

  const createNewSource = useCallback(
    (url: string, dataProviderIdentifier: string) => {
      setIsCreating(true);

      window.electron.ipcRenderer.once(
        'sources.create',
        (createdSource, error) => {
          if (createdSource == null && error == null) return;

          setIsCreating(false);

          if (error != null) {
            setCreatedSource(null);
            setErrorMessage(error as Error);
            return;
          }

          setCreatedSource(createdSource as SourceEntityType);
          setErrorMessage(false);
        },
      );

      window.electron.ipcRenderer.sendMessage(
        'sources.create',
        url,
        dataProviderIdentifier,
      );

      return () => {
        window.electron.ipcRenderer.removeAllListeners('sources.create');
      };
    },
    [],
  );

  const resetSource = useCallback(() => {
    setIsCreating(false);
    setCreatedSource(null);
    setErrorMessage(false);
  }, []);

  return {
    isCreating,
    createdSource,
    errorMessage,
    createNewSource,
    resetSource,
  };
};

export default useCreateNewSource;
