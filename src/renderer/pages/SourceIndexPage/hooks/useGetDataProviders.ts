/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useGetDataProviders.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useEffect, useState } from 'react';
import { Source } from '../../../../main/database';
import { Attributes } from 'sequelize';
import { DataProviderSerializedType } from 'main/app/providers/BaseDataProvider';

const useGetDataProviders = () => {
  const [dataProviders, setDataProviders] = useState<DataProviderSerializedType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | false>(false);

  useEffect(() => {
    window.electron.ipcRenderer.once('providers.list', (dataProviders, error) => {
      if (error != null) {
        setDataProviders([])
        setErrorMessage((error as Error).message);
        return;
      }

      setDataProviders(dataProviders as DataProviderSerializedType[]);
      setErrorMessage(false);
    });

    window.electron.ipcRenderer.sendMessage('providers.list');

    return () => {
      window.electron.ipcRenderer.removeAllListeners('providers.list');
    };
  }, []);

  return {
    dataProviders,
    errorMessage,
  };
};

export default useGetDataProviders;
