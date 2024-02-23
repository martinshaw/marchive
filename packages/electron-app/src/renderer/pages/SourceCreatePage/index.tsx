/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { InputGroup } from '@blueprintjs/core';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import useValidateUrlWithDataProviders from './hooks/useValidateUrlWithDataProviders';
import useCreateNewSource from './hooks/useCreateNewSource';
import useCreateNewSchedule from './hooks/useCreateNewSchedule';
import { useLoaderData, useNavigate } from 'react-router-dom';
import SourceCreatePageExampleSourceGallery from './components/SourceCreatePageExampleSourceGallery';
import SourceCreatePageDataProviderOptionsGrid from './components/SourceCreatePageDataProviderOptionsGrid';
import SourceCreatePageDataProviderOptionsNotFoundMessage from './components/SourceCreatePageDataProviderOptionsNotFoundMessage';
import SourceCreatePageDataProviderOptionsLoadingMessage from './components/SourceCreatePageDataProviderOptionsLoadingMessage';
import getMarchiveIsSetup from '../../layouts/DefaultLayout/functions/getMarchiveIsSetup';
import setMarchiveIsSetup from '../../layouts/DefaultLayout/functions/setMarchiveIsSetup';
import SourceCreatePageLoadingMessage from './components/SourceCreatePageLoadingMessage';
import SourceCreatePageErrorMessage from './components/SourceCreatePageErrorMessage';
import { DataProviderSerializedType } from 'common-types';

import './index.scss';

export const sourceCreatePageDataLoader = async () => ({
  marchiveIsSetup: await getMarchiveIsSetup(),
});

const SourceCreatePage = () => {
  const loaderData = useLoaderData() as { marchiveIsSetup: boolean };

  const [urlValue, setUrlValue] = useState<string>('');

  const { validDataProviders, loadingValidDataProviders, errorMessage } =
    useValidateUrlWithDataProviders(urlValue);

  const {
    isCreating: isCreatingSource,
    createdSource,
    errorMessage: sourceErrorMessage,
    createNewSource,
    resetSource,
  } = useCreateNewSource();

  const {
    isCreating: isCreatingSchedule,
    createdSchedule,
    errorMessage: scheduleErrorMessage,
    createNewSchedule,
    resetSchedule,
  } = useCreateNewSchedule();

  const navigate = useNavigate();

  const handleDataProviderGridItemClick = useCallback(
    (dataProvider: DataProviderSerializedType) => {
      if (isCreatingSource !== false || createdSource != null) return;
      if (validDataProviders.includes(dataProvider) === false) return;

      createNewSource(urlValue, dataProvider.identifier);
    },
    [urlValue, validDataProviders],
  );

  useEffect(() => {
    if (createdSource == null || createdSource?.id == null) return;

    createNewSchedule(createdSource.id, null, null);
  }, [createdSource]);

  useEffect(() => {
    if (createdSchedule == null || createdSource == null) return;

    if (loaderData.marchiveIsSetup !== true)
      setMarchiveIsSetup(true).then(() => {
        navigate(`/sources`);
      });
    else navigate(`/sources`);
  }, [createdSchedule, createdSource, loaderData.marchiveIsSetup]);

  const handleOnExampleSourceSelected = useCallback(
    (url: string, dataProviderIdentifier: string) => {
      if (isCreatingSource !== false || createdSource != null) return;

      createNewSource(url, dataProviderIdentifier);
    },
    [],
  );

  const handleReset = useCallback(() => {
    resetSource();
    resetSchedule();
    setUrlValue('');
  }, []);

  const shouldShowLoading =
    (isCreatingSchedule || isCreatingSource) &&
    sourceErrorMessage === false &&
    scheduleErrorMessage === false;
  const shouldShowErrorMessage =
    sourceErrorMessage !== false || scheduleErrorMessage !== false;
  const shouldShowDataProviderOptions =
    urlValue !== '' &&
    loadingValidDataProviders === false &&
    validDataProviders.length > 0 &&
    isCreatingSchedule === false &&
    isCreatingSource === false &&
    sourceErrorMessage === false &&
    scheduleErrorMessage === false;
  const shouldShowDataProviderErrorMessage =
    urlValue !== '' &&
    loadingValidDataProviders === false &&
    validDataProviders.length === 0 &&
    isCreatingSchedule === false &&
    isCreatingSource === false &&
    sourceErrorMessage === false &&
    scheduleErrorMessage === false;
  const shouldShowDataProviderLoadingMessage =
    urlValue !== '' &&
    loadingValidDataProviders &&
    validDataProviders.length === 0 &&
    isCreatingSchedule === false &&
    isCreatingSource === false &&
    sourceErrorMessage === false &&
    scheduleErrorMessage === false;
  const shouldShowExampleSourceGallery =
    urlValue === '' &&
    isCreatingSchedule === false &&
    isCreatingSource === false &&
    sourceErrorMessage === false &&
    scheduleErrorMessage === false;

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

      {shouldShowLoading && <SourceCreatePageLoadingMessage />}

      {shouldShowErrorMessage && (
        <SourceCreatePageErrorMessage
          errorMessages={
            [sourceErrorMessage, scheduleErrorMessage].filter(
              (message) => message !== false,
            ) as Error[]
          }
          onResetUrlValue={() => handleReset()}
        />
      )}

      {shouldShowDataProviderOptions && (
        <SourceCreatePageDataProviderOptionsGrid
          dataProviders={validDataProviders}
          onDataProviderOptionSelected={handleDataProviderGridItemClick}
        />
      )}

      {shouldShowDataProviderErrorMessage && (
        <SourceCreatePageDataProviderOptionsNotFoundMessage
          onResetUrlValue={() => handleReset()}
        />
      )}

      {shouldShowDataProviderLoadingMessage && (
        <SourceCreatePageDataProviderOptionsLoadingMessage />
      )}

      {shouldShowExampleSourceGallery && (
        <SourceCreatePageExampleSourceGallery
          onExampleSourceSelected={handleOnExampleSourceSelected}
        />
      )}
    </>
  );

  return createSourceFragment;
};

export default SourceCreatePage;
