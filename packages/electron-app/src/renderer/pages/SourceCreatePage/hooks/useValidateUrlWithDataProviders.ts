/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useValidateUrlWithDataProviders.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { DataProviderSerializedType } from 'data-providers/src/BaseDataProvider'

const useValidateUrlWithDataProviders = (url: string) => {
  const debouncedUrlValue = useDebounce(url, 700)

  const [validDataProviders, setValidDataProviders] = useState<DataProviderSerializedType[]>([])
  const [loadingValidDataProviders, setLoadingValidDataProviders] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<Error | false>(false)

  useEffect(() => {
    setValidDataProviders([])
    setLoadingValidDataProviders(true)
    setErrorMessage(false)

    window.electron.ipcRenderer.once('data-providers.validate', (validDataProvidersValue, error) => {
      if (error != null) {
        setValidDataProviders([])
        setLoadingValidDataProviders(false)
        setErrorMessage(error as Error)
        return
      }

      setValidDataProviders(validDataProvidersValue as DataProviderSerializedType[])
      setLoadingValidDataProviders(false)
      setErrorMessage(false)
    })

    window.electron.ipcRenderer.sendMessage('data-providers.validate', debouncedUrlValue)

    return () => { window.electron.ipcRenderer.removeAllListeners('data-providers.validate') }
  }, [debouncedUrlValue])

  return {
    validDataProviders,
    loadingValidDataProviders,
    errorMessage
  }
}

export default useValidateUrlWithDataProviders
