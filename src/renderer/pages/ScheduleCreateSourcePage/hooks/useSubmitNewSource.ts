/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useSubmitNewSource.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useCallback, useState } from 'react';
import { Source } from '../../../../main/database';

const useSubmitNewSource = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdSource, setCreatedSource] = useState<Source | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitNewSource = useCallback((urlValue: string) => {
    setIsSubmitting(true);

    window.electron.ipcRenderer.on(
      'sources.submit-new-source',
      (createdSourceValue, errorMessageValue) => {
        if (createdSourceValue == null && errorMessageValue == null) return;

        setIsSubmitting(false);

        if (errorMessageValue != null) {
          setErrorMessage(errorMessageValue as string);
          return;
        }

        setCreatedSource(createdSourceValue as Source);
      }
    );

    window.electron.ipcRenderer.sendMessage(
      'sources.submit-new-source',
      urlValue
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        'sources.submit-new-source'
      );
    };
  }, []);

  return {
    isSubmitting,
    createdSource,
    errorMessage,
    submitNewSource,
  };
};

export default useSubmitNewSource;
