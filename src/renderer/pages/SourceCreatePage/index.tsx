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
import useSubmitNewSource from './hooks/useSubmitNewSource'

import './index.scss'
import { DataProviderSerializedType } from 'main/app/providers/BaseDataProvider'

const SourceCreatePage = () => {
  const [urlValue, setUrlValue] = useState('')

  const {
    validDataProviders,
    errorMessage
  } = useValidateUrlWithDataProviders(urlValue)

  const {
    isSubmitting,
    createdSource,
    errorMessage: sourceErrorMessage,
    submitNewSource,
  } = useSubmitNewSource()

  // const navigate = useNavigate()

  useEffect(() => {
    if (sourceErrorMessage === false) return

    alert(sourceErrorMessage)
  }, [sourceErrorMessage])

  const handleDataProviderGridItemClick = useCallback(
    (dataProvider: DataProviderSerializedType) => {
      if (validDataProviders.includes(dataProvider) === false) return
      submitNewSource(urlValue, dataProvider.identifier)
    },
    [urlValue, validDataProviders]
  )

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

          console.log(dataProvider)

          return (
            <Card
              key={dataProvider.identifier}
              className={`data-providers__grid__item`}
              onClick={() => handleDataProviderGridItemClick(dataProvider)}
            >
              {/* <Icon icon={dataProvider.icon} /> */}
              <Text>{dataProvider.name}</Text>
            </Card>
          )
        })}
      </div>
    </>
  )

  return createSourceFragment
}

export default SourceCreatePage
