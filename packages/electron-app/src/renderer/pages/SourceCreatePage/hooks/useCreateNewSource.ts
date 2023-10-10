/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCreateNewSource.ts
Created:  2023-08-02T03:17:08.445Z
Modified: 2023-08-02T03:17:08.445Z

Description: description
*/

import { useCallback, useState } from 'react'
import { Source } from 'database'
import { SourceAttributes } from 'database/src/models/Source'

const useCreateNewSource = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createdSource, setCreatedSource] = useState<SourceAttributes | null>(null)
  const [errorMessage, setErrorMessage] = useState<Error | false>(false)

  const createNewSource = useCallback((url: string, dataProviderIdentifier: string) => {
    setIsCreating(true)

    window.electron.ipcRenderer.once(
      'sources.create',
      (createdSource, errorMessage) => {
        if (createdSource == null && errorMessage == null) return

        setIsCreating(false)

        if (errorMessage != null) {
          setCreatedSource(null)
          setErrorMessage(errorMessage as Error)
          console.error(errorMessage)
          return
        }

        setCreatedSource(createdSource as Source)
        setErrorMessage(false)
      }
    )

    window.electron.ipcRenderer.sendMessage('sources.create', url, dataProviderIdentifier)

    return () => { window.electron.ipcRenderer.removeAllListeners('sources.create') }
  }, [])

  const resetSource = useCallback(() => {
    setIsCreating(false)
    setCreatedSource(null)
    setErrorMessage(false)
  }, [])

  return {
    isCreating,
    createdSource,
    errorMessage,
    createNewSource,
    resetSource,
  }
}

export default useCreateNewSource
