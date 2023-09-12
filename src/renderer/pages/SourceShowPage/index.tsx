/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/
import { useMemo } from 'react';
import { Button, Card, Text } from '@blueprintjs/core';
import { LoaderFunction, NavLink, useLoaderData } from 'react-router-dom';
import { useCallback } from 'react';
import SourceShowPageGridItemPreview from './components/SourceShowPageGridItemPreview';
import { SourceAttributes } from 'main/database/models/Source';
import getSource from './functions/getSource';

import './index.scss';
import { DataProviderSerializedType } from 'main/app/data_providers/BaseDataProvider';
import getDataProviders from '../SourceIndexPage/functions/getDataProviders';
import SourceIndexPageListItemCardScheduleCaption from '../SourceIndexPage/components/SourceIndexPageListItemCardScheduleCaption';

type SourceShowPageLoaderReturnType = {
  source: SourceAttributes | null;
  sourceError: Error | false;
  dataProviders: DataProviderSerializedType[];
  dataProvidersError: Error | false;
};

export const SourceShowPageLoader: LoaderFunction = async ({params}): Promise<SourceShowPageLoaderReturnType> => {
  let source: SourceAttributes | null = null;
  let sourceError: Error | false = false;
  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersError: Error | false = false;

  if (params.sourceId == null) return {
    source,
    sourceError: new Error('No source was specified.'),
    dataProviders,
    dataProvidersError,
  }
  const sourceId = parseInt(params.sourceId.toString());

  try { source = await getSource(sourceId, true, true, true); }
  catch (error) { sourceError = error as Error; }

  try { dataProviders = await getDataProviders(); }
  catch (error) { dataProvidersError = error as Error; }

  return {
    source,
    sourceError,
    dataProviders,
    dataProvidersError,
  }
}

const SourceShowPage = () => {
  const {
    source,
    sourceError,
    dataProviders,
    dataProvidersError,
  } = useLoaderData() as SourceShowPageLoaderReturnType

  const sourceCapturesCount = useMemo(
    () => source?.schedules == null ?
      0 :
      (source?.schedules || []).reduce((c, schedule) => (c + (schedule.captures ?? []).length), 0)
    ,
    [source]
  )

  const humanDateCaption = useCallback((date: Date): string => {
    const dateNow = new Date();

    const dateIsToday = dateNow.getFullYear() === date.getFullYear() && dateNow.getMonth() === date.getMonth() && dateNow.getDate() === date.getDate();
    const dateIsYesterday = dateNow.getFullYear() === date.getFullYear() && dateNow.getMonth() === date.getMonth() && dateNow.getDate() === date.getDate() - 1;

    if (dateIsToday) {
      return 'Today at ' + date.toLocaleTimeString();
    } else if (dateIsYesterday) {
      return 'Yesterday at ' + date.toLocaleTimeString();
    } else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
    }
  }, [])

  const dataProvider: DataProviderSerializedType | null = dataProviders.find(
    dataProvider => dataProvider.identifier === source?.dataProviderIdentifier
  ) || null;

  return (
    <>
      <div className="source-captures__source-domain">
        <div className="source-captures__source-domain__title">
          {source?.sourceDomain?.faviconImage != null && source?.sourceDomain?.faviconImage !== '' && <img src={source?.sourceDomain?.faviconImage ?? undefined} alt={source?.sourceDomain?.name} /> }
          <Text ellipsize>{source?.sourceDomain?.name}</Text>
        </div>
        <div className="source-captures__source-domain__url">
          <Text ellipsize>{source?.url}</Text>
        </div>
      </div>


      {dataProvider != null && source != null && (
        <div className="source-captures__provider-row">
          <img src={dataProvider?.iconInformation?.filePath} alt={dataProvider?.name} className={dataProvider.iconInformation.shouldInvertOnDarkMode ? 'source-captures__provider-row__image--invert' : ''} />
          <Text>{dataProvider?.name}</Text>
          <div className="source-captures__provider-row__schedule">
            <SourceIndexPageListItemCardScheduleCaption source={source} />
          </div>
        </div>
      )}

      <div className="source-captures__buttons">
        <Text>
          {sourceCapturesCount} Source Capture{sourceCapturesCount > 1 ? 's' : ''}
          <span className="source-captures__buttons__hint">
            Right-click a source's capture to edit or delete it.
          </span>
        </Text>
        {/* <NavLink to="/sources/create">
          {() => (
            <Button intent="success" icon="add" text="Add a new Source" />
          )}
        </NavLink> */}
      </div>

      <div className="source-captures__grid">
        {(source?.schedules ?? []).map((schedule, scheduleIndex) => (
          (schedule?.captures ?? []).map((capture, captureIndex) => (
            <Card key={capture.id} className="source-captures__grid__item">
              <div className="source-captures__grid__item__title">
                <Text ellipsize>{humanDateCaption(capture.createdAt)}</Text>
              </div>

              <SourceShowPageGridItemPreview
                schedule={schedule}
                capture={capture}
              />
            </Card>
          ))
        ))}

      </div>
    </>
  );
};

export default SourceShowPage;
