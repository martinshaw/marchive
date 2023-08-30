/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SchedulesCreateSourcePage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, InputGroup, Text } from '@blueprintjs/core';
import { ChangeEvent, useEffect, useState } from 'react';

import useGetSourceProviders from './hooks/useGetSourceProviders';
import useValidateUrlWithSourceProviders from './hooks/useValidateUrlWithSourceProviders';
import useSubmitNewSource from './hooks/useSubmitNewSource';

import './index.scss';

const SchedulesCreateSourcePage = () => {
  const [urlValue, setUrlValue] = useState('');

  const sourceProviders = useGetSourceProviders();

  const validSourceProviderIdentifiers =
    useValidateUrlWithSourceProviders(urlValue);

  const {
    isSubmitting,
    createdSource,
    errorMessage: sourceErrorMessage,
    submitNewSource,
  } = useSubmitNewSource();

  const availableSourceActions = useGetAvailableSourceActions(createdSource);

  const assignedActions = null;

  const createdSchedule = null;

  // const navigate = useNavigate();

  useEffect(() => {
    if (sourceErrorMessage != null) {
      alert(sourceErrorMessage);
    }
  }, [sourceErrorMessage]);

  const createSourceFragment = (
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

  const assignActionsFragment = <Text>Assign actions</Text>;

  const createScheduleFragment = <Text>Create schedule</Text>;

  if (
    createdSource != null &&
    assignedActions != null &&
    createdSchedule == null
  )
    return createScheduleFragment;

  if (createdSource != null && assignedActions == null)
    return assignActionsFragment;

  return createSourceFragment;
};

export default SchedulesCreateSourcePage;
