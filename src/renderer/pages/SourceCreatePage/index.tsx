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

import './index.scss'
import { DataProviderSerializedType } from 'main/app/providers/BaseDataProvider'
import useCreateNewSchedule from './hooks/useCreateNewSchedule'
import { useNavigate } from 'react-router-dom'

const SourceCreatePage = () => {
  const [urlValue, setUrlValue] = useState('')

  const {
    validDataProviders,
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
    if (createdSchedule == null) return

    navigate(`/sources/${createdSource.id}`)
  }, [createdSchedule, createdSource, navigate])

  const [hoveredProviderGridItem, setHoveredProviderGridItem] = useState<DataProviderSerializedType | null>(null)

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

      <div className="data-providers__grid">
        {validDataProviders.map((dataProvider) => {
          if (dataProvider == null) return null

          const hoverClassName = 'data-providers__grid__item' + (hoveredProviderGridItem?.identifier === dataProvider.identifier ? '--hover' : (hoveredProviderGridItem != null ? '--not-hover' : ''))

          return (
            <Card
              key={dataProvider.identifier}
              interactive={isCreatingSource === false && createdSource == null && isCreatingSchedule === false}
              className={"data-providers__grid__item " + hoverClassName}
              onClick={() => handleDataProviderGridItemClick(dataProvider)}
              onMouseEnter={() => setHoveredProviderGridItem(dataProvider)}
              onMouseLeave={() => setHoveredProviderGridItem(null)}
            >
              <img src={dataProvider.iconInformation.filePath} className={dataProvider.iconInformation.shouldInvertOnDarkMode ? 'data-providers__grid__item__image--invert' : ''} />
              <Text>{dataProvider.name}</Text>
            </Card>
          )
        })}
      </div>

      <div className="data-providers__description">
        <Text>
          {hoveredProviderGridItem != null ? hoveredProviderGridItem.description : ''}
        </Text>
      </div>

    </>
  )

  return createSourceFragment
}

export default SourceCreatePage
