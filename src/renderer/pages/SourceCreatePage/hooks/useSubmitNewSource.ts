/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useSubmitNewSource.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useCallback, useState } from 'react'
import { Source } from '../../../../main/database'
import { Attributes } from 'sequelize'

const useSubmitNewSource = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [createdSource, setCreatedSource] = useState<Attributes<Source> | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | false>(false)

  const submitNewSource = useCallback((url: string, dataProviderIdentifier: string) => {
    setIsSubmitting(true)

    window.electron.ipcRenderer.once(
      'sources.create',
      (createdSource, errorMessage) => {
        if (createdSource == null && errorMessage == null) return

        setIsSubmitting(false)

        if (errorMessage != null) {
          setCreatedSource(null)
          setErrorMessage(errorMessage as string)
          return
        }

        setCreatedSource(createdSource as Source)
        setErrorMessage(false)
      }
    )

    window.electron.ipcRenderer.sendMessage('sources.create', url, dataProviderIdentifier)

    return () => { window.electron.ipcRenderer.removeAllListeners('sources.create') }
  }, [])

  return {
    isSubmitting,
    createdSource,
    errorMessage,
    submitNewSource,
  }
}

export default useSubmitNewSource
