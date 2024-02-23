/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import {
  Navigate,
  useLoaderData,
  LoaderFunction,
} from 'react-router-dom';
import { useMemo } from 'react';
import AppToaster from '../../toaster';
import { Text } from '@blueprintjs/core';
import getCapture from './functions/getCapture';
import CaptureShowPageFragment from './components/CaptureShowPageFragment';
import getDataProviders from '../SourceIndexPage/functions/getDataProviders';
import CopyableExternalUrlLinkText from '../../../renderer/layouts/DefaultLayout/components/CopyableExternalUrlLinkText';
import SourceIndexPageListItemCardScheduleCaption from '../SourceIndexPage/components/SourceIndexPageListItemCardScheduleCaption';
import SourceIndexPageChangeIntervalDropdownButton from '../SourceIndexPage/components/SourceIndexPageChangeIntervalDropdownButton';

import './index.scss';
import { CaptureEntityType, DataProviderSerializedType, ScheduleEntityType, SourceEntityType } from 'common-types';

type CaptureShowPageLoaderReturnType = {
  capture: CaptureEntityType | null;
  captureError: Error | false;
  dataProviders: DataProviderSerializedType[];
  dataProvidersError: Error | false;
};

export const CaptureShowPageLoader: LoaderFunction = async ({
  params,
}): Promise<CaptureShowPageLoaderReturnType> => {
  let capture: CaptureEntityType | null = null;
  let captureError: Error | false = false;
  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersError: Error | false = false;

  if (params.captureId == null)
    return {
      capture,
      captureError: new Error('No capture was specified.'),
      dataProviders,
      dataProvidersError,
    };
  const captureId = parseInt(params.captureId.toString());

  try {
    capture = await getCapture(captureId, true, true, true, true);
  } catch (error) {
    captureError = error as Error;
  }

  try {
    dataProviders = await getDataProviders();
  } catch (error) {
    dataProvidersError = error as Error;
  }

  return {
    capture,
    captureError,
    dataProviders,
    dataProvidersError,
  };
};

const CaptureShowPage = () => {
  const { capture, captureError, dataProviders, dataProvidersError } =
    useLoaderData() as CaptureShowPageLoaderReturnType;

  const schedule: ScheduleEntityType | null = capture?.schedule ?? null;
  const source: SourceEntityType | null = capture?.schedule?.source ?? null;

  if (source == null || schedule == null || capture == null) {
    let errorMessage =
      'An error occurred when we tried to find the chosen capture.';
    if (typeof captureError === 'string') errorMessage = captureError;
    if (captureError instanceof Error) errorMessage = captureError.message;

    AppToaster.clear();
    AppToaster.show({
      message: errorMessage,
      intent: 'danger',
    });

    return <Navigate to="/sources" replace={true} />;
  }

  const dataProvider: DataProviderSerializedType | null =
    dataProviders.find(
      (dataProvider) =>
        dataProvider.identifier === source?.dataProviderIdentifier
    ) || null;
  if (dataProvider == null) {
    let errorMessage =
      'The data provider which captured this source could not be found.';
    if (typeof dataProvidersError === 'string')
      errorMessage = dataProvidersError;
    if (dataProvidersError instanceof Error)
      errorMessage = dataProvidersError.message;

    AppToaster.clear();
    AppToaster.show({
      message: errorMessage,
      intent: 'danger',
    });

    return <Navigate to="/sources" replace={true} />;
  }

  const capturePartsCount = useMemo(
    () =>
      source?.schedules == null
        ? 0
        : (source?.schedules || []).reduce(
            (c, schedule) => c + (schedule.captures ?? []).length,
            0
          ),
    [source]
  );

  let sourceNameText: string = source?.sourceDomain?.name ?? '';
  if (source?.name != null && source?.name !== '') sourceNameText = source.name;

  return (
    <>
      <div className="capture__source-domain">
        <div className="capture__source-domain__title">
          {source?.sourceDomain?.faviconPath != null &&
            source?.sourceDomain?.faviconPath !== '' && (
              <img
                src={source?.sourceDomain?.faviconPath ?? undefined}
                alt={source?.sourceDomain?.name}
              />
            )}
          <Text ellipsize>{sourceNameText}</Text>
        </div>
        <div className="capture__source-domain__url">
          {source?.url != null && (
            <CopyableExternalUrlLinkText url={source.url} />
          )}
        </div>
      </div>

      <div className="capture__provider-row">
        <img
          src={dataProvider?.iconInformation?.filePath}
          alt={dataProvider?.name}
          className={
            dataProvider.iconInformation.shouldInvertOnDarkMode
              ? 'capture__provider-row__image--invert'
              : ''
          }
        />
        <Text>{dataProvider?.name}</Text>
        <div className="capture__provider-row__schedule">
          <SourceIndexPageListItemCardScheduleCaption schedule={schedule} />
          <SourceIndexPageChangeIntervalDropdownButton
            source={source}
            schedule={schedule}
          />
        </div>
      </div>

      {capturePartsCount > 1 && (
        <div className="capture__buttons">
          <Text>
            {capturePartsCount} Source Save{capturePartsCount > 1 ? 's' : ''}
            <span className="capture__buttons__hint">
              Right-click a source's save to {/*edit or */}delete it.
            </span>
          </Text>
          {/* <Button intent="success" icon="add" text="Add a new Source" /> */}
        </div>
      )}

      <div className="capture__main">
        <CaptureShowPageFragment
          source={source}
          schedule={schedule}
          capture={capture}
          dataProvider={dataProvider}
        />
      </div>
    </>
  );
};

export default CaptureShowPage;
