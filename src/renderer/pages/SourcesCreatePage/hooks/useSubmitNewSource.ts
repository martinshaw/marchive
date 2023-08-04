/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useSubmitNewSource.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useCallback, useState } from 'react';

const useSubmitNewSource = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdSourceId, setCreatedSourceId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitNewSource = useCallback((urlValue: string) => {
    setIsSubmitting(true);

    window.electron.ipcRenderer.on(
      'sources.submit-new-source',
      (createdSourceIdValue, errorMessageValue) => {
        if (createdSourceIdValue == null && errorMessageValue == null) return;

        setIsSubmitting(false);

        if (errorMessageValue != null) {
          setErrorMessage(errorMessageValue as string);
          return;
        }

        setCreatedSourceId(Number(createdSourceIdValue) as number);
      }
    );

    window.electron.ipcRenderer.sendMessage(
      'sources.submit-new-source',
      urlValue
    );
  }, []);

  return {
    isSubmitting,
    createdSourceId,
    errorMessage,
    submitNewSource,
  };
};

export default useSubmitNewSource;
