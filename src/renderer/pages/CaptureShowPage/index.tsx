/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/
import { useMemo } from 'react';
import AppToaster from '../../toaster';
import getCapture from './functions/getCapture';
import { Button, Card, Text } from '@blueprintjs/core';
import { SourceAttributes } from '../../../main/database/models/Source';
import { CaptureAttributes } from '../../../main/database/models/Capture';
import { ScheduleAttributes } from '../../../main/database/models/Schedule';
import getDataProviders from '../SourceIndexPage/functions/getDataProviders';
import CaptureShowPageFragment from './components/CaptureShowPageFragment';
import { LoaderFunction, NavLink, Navigate, useLoaderData } from 'react-router-dom';
import { DataProviderSerializedType } from '../../../main/app/data_providers/BaseDataProvider';
import openExternalUrlInBrowser from 'renderer/layouts/DefaultLayout/functions/openExternalUrlInBrowser';
import SourceIndexPageListItemCardScheduleCaption from '../SourceIndexPage/components/SourceIndexPageListItemCardScheduleCaption';

import './index.scss';

type CaptureShowPageLoaderReturnType = {
  capture: CaptureAttributes | null;
  captureError: Error | false;
  dataProviders: DataProviderSerializedType[];
  dataProvidersError: Error | false;
};

export const CaptureShowPageLoader: LoaderFunction = async ({params}): Promise<CaptureShowPageLoaderReturnType> => {
  let capture: CaptureAttributes | null = null;
  let captureError: Error | false = false;
  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersError: Error | false = false;

  if (params.captureId == null) return {
    capture,
    captureError: new Error('No capture was specified.'),
    dataProviders,
    dataProvidersError,
  }
  const captureId = parseInt(params.captureId.toString());

  try { capture = await getCapture(captureId, true, true, true, true); }
  catch (error) { captureError = error as Error; }

  try { dataProviders = await getDataProviders(); }
  catch (error) { dataProvidersError = error as Error; }

  return {
    capture,
    captureError,
    dataProviders,
    dataProvidersError,
  }
}

const CaptureShowPage = () => {
  const {
    capture,
    captureError,
    dataProviders,
    dataProvidersError,
  } = useLoaderData() as CaptureShowPageLoaderReturnType

  const schedule: ScheduleAttributes | null = capture?.schedule ?? null;
  const source: SourceAttributes | null = capture?.schedule?.source ?? null;

  if (source == null || schedule == null || capture == null) {
    let errorMessage = 'An error occurred when we tried to find the chosen capture.';
    if (typeof captureError === 'string') errorMessage = captureError;
    if (captureError instanceof Error) errorMessage = captureError.message;

    AppToaster.clear();
    AppToaster.show({
      message: errorMessage,
      intent: 'danger',
    });

    return <Navigate to='/sources' replace={true} />
  }

  const dataProvider: DataProviderSerializedType | null = dataProviders.find(dataProvider => dataProvider.identifier === source?.dataProviderIdentifier) || null;
  if (dataProvider == null) {
    let errorMessage = 'The data provider which captured this source could not be found.';
    if (typeof dataProvidersError === 'string') errorMessage = dataProvidersError;
    if (dataProvidersError instanceof Error) errorMessage = dataProvidersError.message;

    AppToaster.clear();
    AppToaster.show({
      message: errorMessage,
      intent: 'danger',
    });

    return <Navigate to='/sources' replace={true} />
  }

  const capturePartsCount = useMemo(
    () => source?.schedules == null ?
      0 :
      (source?.schedules || []).reduce((c, schedule) => (c + (schedule.captures ?? []).length), 0)
    ,
    [source]
  )

  return (
    <>
      <div className="capture__source-domain">
        <div className="capture__source-domain__title">
          {source?.sourceDomain?.faviconImage != null && source?.sourceDomain?.faviconImage !== '' && <img src={source?.sourceDomain?.faviconImage ?? undefined} alt={source?.sourceDomain?.name} /> }
          <Text ellipsize>{source?.sourceDomain?.name}</Text>
        </div>
        <div className="capture__source-domain__url">
          <Text ellipsize onClick={() => {openExternalUrlInBrowser(source.url)}}>{source?.url}</Text>
        </div>
      </div>

      <div className="capture__provider-row">
        <img src={dataProvider?.iconInformation?.filePath} alt={dataProvider?.name} className={dataProvider.iconInformation.shouldInvertOnDarkMode ? 'capture__provider-row__image--invert' : ''} />
        <Text>{dataProvider?.name}</Text>
        <div className="capture__provider-row__schedule">
          <SourceIndexPageListItemCardScheduleCaption source={source} />
        </div>
      </div>

      {capturePartsCount > 1 &&
        <div className="capture__buttons">
          <Text>
            {capturePartsCount} Capture Part{capturePartsCount > 1 ? 's' : ''}
            <span className="capture__buttons__hint">
              Right-click a source's capture part to edit or delete it.
            </span>
          </Text>
          {/* <Button intent="success" icon="add" text="Add a new Source" /> */}
        </div>
      }

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
