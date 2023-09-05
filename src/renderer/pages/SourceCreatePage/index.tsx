/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, InputGroup, Text } from '@blueprintjs/core'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import useValidateUrlWithDataProviders from './hooks/useValidateUrlWithDataProviders'
import useCreateNewSource from './hooks/useCreateNewSource'
import { DataProviderSerializedType } from '../../../main/app/data_providers/BaseDataProvider'
import useCreateNewSchedule from './hooks/useCreateNewSchedule'
import { useLoaderData, useNavigate } from 'react-router-dom'
import SourceCreatePageExampleSourceGallery from './components/SourceCreatePageExampleSourceGallery'
import SourceCreatePageDataProviderOptionsGrid from './components/SourceCreatePageDataProviderOptionsGrid'
import SourceCreatePageDataProviderOptionsNotFoundMessage from './components/SourceCreatePageDataProviderOptionsNotFoundMessage'
import SourceCreatePageDataProviderOptionsLoadingMessage from './components/SourceCreatePageDataProviderOptionsLoadingMessage'
import marchiveIsSetup from '../../layouts/DefaultLayout/functions/marchiveIsSetup'

import './index.scss'

export const sourceCreatePageDataLoader = async () => ({
  marchiveIsSetup: await marchiveIsSetup(),
})

const SourceCreatePage = () => {
  const loaderData = useLoaderData() as { marchiveIsSetup: boolean }

  const [urlValue, setUrlValue] = useState<string>('')

  const {
    validDataProviders,
    loadingValidDataProviders,
    errorMessage
  } = useValidateUrlWithDataProviders(urlValue)

  const {
    isCreating: isCreatingSource,
    createdSource,
    errorMessage: sourceErrorMessage,
    createNewSource,
  } = useCreateNewSource()

  const {
    isCreating: isCreatingSchedule,
    createdSchedule,
    errorMessage: scheduleErrorMessage,
    createNewSchedule,
  } = useCreateNewSchedule()

  const navigate = useNavigate()

  useEffect(() => {
    if (sourceErrorMessage !== false) alert(sourceErrorMessage)
    if (scheduleErrorMessage !== false) alert(scheduleErrorMessage)
  }, [sourceErrorMessage, scheduleErrorMessage])

  const handleDataProviderGridItemClick = useCallback(
    (dataProvider: DataProviderSerializedType) => {
      if (isCreatingSource !== false || createdSource != null) return
      if (validDataProviders.includes(dataProvider) === false) return

      createNewSource(urlValue, dataProvider.identifier)
    },
    [urlValue, validDataProviders]
  )

  useEffect(() => {
    if (createdSource == null) return

    createNewSchedule(createdSource.id, null, null)
  }, [createdSource])

  useEffect(() => {
    if (createdSchedule == null || createdSource == null) return

    console.log('SHOULD REDIRECT', loaderData.marchiveIsSetup, createdSchedule, createdSource)

    if (loaderData.marchiveIsSetup === false)
      marchiveIsSetup(true).then(() => { navigate(`/sources`) })
    else
      navigate(`/sources`)

  }, [createdSchedule, createdSource, loaderData.marchiveIsSetup])

  const handleOnExampleSourceSelected = useCallback((url: string, dataProviderIdentifier: string) => {
    if (isCreatingSource !== false || createdSource != null) return

    createNewSource(url, dataProviderIdentifier)
  }, [])

  const createSourceFragment = (
    <>
      <div className="sources__input">
        <InputGroup
          large
          fill
          leftIcon="search"
          placeholder="Enter the address of a blog, gallery, RSS feed etc..."
          value={urlValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setUrlValue(event.target.value)
          }
          tabIndex={0}
          inputRef={(ref) => ref?.focus()}
        />
      </div>

      {urlValue !== '' && loadingValidDataProviders === false && validDataProviders.length > 0 &&
        <SourceCreatePageDataProviderOptionsGrid
          dataProviders={validDataProviders}
          isInteractive={isCreatingSource === false && createdSource == null && isCreatingSchedule === false}
          onDataProviderOptionSelected={handleDataProviderGridItemClick}
        />
      }

      {urlValue !== '' && loadingValidDataProviders === false && validDataProviders.length === 0 &&
        <SourceCreatePageDataProviderOptionsNotFoundMessage
          onResetUrlValue={() => setUrlValue('')}
        />
      }

      {urlValue !== '' && loadingValidDataProviders && validDataProviders.length === 0 &&
        <SourceCreatePageDataProviderOptionsLoadingMessage />
      }

      {urlValue === '' &&
        <SourceCreatePageExampleSourceGallery
          onExampleSourceSelected={handleOnExampleSourceSelected}
        />
      }

    </>
  )

  return createSourceFragment
}

export default SourceCreatePage
