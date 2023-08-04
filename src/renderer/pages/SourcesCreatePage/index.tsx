/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourcesCreatePage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, InputGroup, Text } from '@blueprintjs/core';
import { ChangeEvent, useEffect, useState } from 'react';

import useGetSourceProviders from './hooks/useGetSourceProviders';
import './index.scss';
import useValidateUrlWithSourceProviders from './hooks/useValidateUrlWithSourceProviders';
import useSubmitNewSource from './hooks/useSubmitNewSource';

const SourcesCreatePage = () => {
  const [urlValue, setUrlValue] = useState('');

  const sourceProviders = useGetSourceProviders();

  const validSourceProviderIdentifiers =
    useValidateUrlWithSourceProviders(urlValue);

  const { isSubmitting, createdSourceId, errorMessage, submitNewSource } =
    useSubmitNewSource();

  useEffect(() => {
    if (errorMessage != null) {
      alert(errorMessage);
      return;
    }

    if (createdSourceId == null) return;
    if (Number.isNaN(Number(createdSourceId))) return;

    setUrlValue('');

    alert(`Created a new source with id: ${createdSourceId}`);
  }, [createdSourceId, errorMessage]);

  return (
    <>
      <div className="source-providers__input">
        <InputGroup
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
        <Button
          icon="add"
          text="&nbsp;Add&nbsp;a&nbsp;new&nbsp;Source&nbsp;"
          disabled={
            isSubmitting ||
            urlValue === '' ||
            validSourceProviderIdentifiers.length === 0
          }
          onClick={() => submitNewSource(urlValue)}
          tabIndex={0}
        />
      </div>

      <div className="source-providers__grid">
        {sourceProviders.map((sourceProvider) => {
          if (sourceProvider == null) return null;

          const validSourceProviderClassName =
            validSourceProviderIdentifiers.includes(
              sourceProvider.identifier
            ) &&
            urlValue !== '' &&
            validSourceProviderIdentifiers.length > 0
              ? 'source-providers__grid__item--valid'
              : 'source-providers__grid__item--invalid';

          return (
            <Card
              key={sourceProvider.identifier}
              className={`source-providers__grid__item ${validSourceProviderClassName}`}
            >
              <Icon icon={sourceProvider.icon} />
              <Text>{sourceProvider.name}</Text>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SourcesCreatePage;
