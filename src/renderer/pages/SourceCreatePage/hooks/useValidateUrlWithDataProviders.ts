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
import { DataProviderSerializedType } from 'main/app/providers/BaseDataProvider'

const useValidateUrlWithDataProviders = (url: string) => {
  const debouncedUrlValue = useDebounce(url, 700)

  const [validDataProviders, setValidDataProviders] = useState<DataProviderSerializedType[]>([])
  const [errorMessage, setErrorMessage] = useState<string | false>(false)

  useEffect(() => {
    setValidDataProviders([])
    setErrorMessage(false)

    window.electron.ipcRenderer.once('providers.validate', (validDataProvidersValue, errors) => {
      if (errors != null) {
        setValidDataProviders([])
        setErrorMessage((errors as Error).message)
        return
      }

      setValidDataProviders(validDataProvidersValue as DataProviderSerializedType[])
      setErrorMessage(false)
    })

    window.electron.ipcRenderer.sendMessage('providers.validate', debouncedUrlValue)

    return () => { window.electron.ipcRenderer.removeAllListeners('providers.validate') }
  }, [debouncedUrlValue])

  return {
    validDataProviders,
    errorMessage
  }
}

export default useValidateUrlWithDataProviders
