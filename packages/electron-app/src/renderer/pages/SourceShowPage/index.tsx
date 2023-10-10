/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import {
  LoaderFunction,
  Navigate,
  useLoaderData,
} from 'react-router-dom';
import { useMemo } from 'react';
import AppToaster from '../../toaster';
import { Text } from '@blueprintjs/core';
import { Capture, Schedule } from 'database';
import getSource from './functions/getSource';
import { AutoSizer, Grid } from 'react-virtualized';
import { SourceAttributes } from 'database/src/models/Source';
import getDataProviders from '../SourceIndexPage/functions/getDataProviders';
import SourceShowPageGridItemPreview from './components/SourceShowPageGridItemPreview';
import { DataProviderSerializedType } from '../../../main/app/data_providers/BaseDataProvider';
import CopyableExternalUrlLinkText from '../../../renderer/layouts/DefaultLayout/components/CopyableExternalUrlLinkText';
import SourceIndexPageListItemCardScheduleCaption from '../SourceIndexPage/components/SourceIndexPageListItemCardScheduleCaption';
import SourceIndexPageChangeIntervalDropdownButton from '../SourceIndexPage/components/SourceIndexPageChangeIntervalDropdownButton';

import './index.scss';

type SourceShowPageLoaderReturnType = {
  source: SourceAttributes | null;
  sourceError: Error | false;
  dataProviders: DataProviderSerializedType[];
  dataProvidersError: Error | false;
};

export const SourceShowPageLoader: LoaderFunction = async ({
  params,
}): Promise<SourceShowPageLoaderReturnType> => {
  let source: SourceAttributes | null = null;
  let sourceError: Error | false = false;
  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersError: Error | false = false;

  if (params.sourceId == null)
    return {
      source,
      sourceError: new Error('No source was specified.'),
      dataProviders,
      dataProvidersError,
    };
  const sourceId = parseInt(params.sourceId.toString());

  try {
    source = await getSource(sourceId, true, true, true);
  } catch (error) {
    sourceError = error as Error;
  }

  try {
    dataProviders = await getDataProviders();
  } catch (error) {
    dataProvidersError = error as Error;
  }

  return {
    source,
    sourceError,
    dataProviders,
    dataProvidersError,
  };
};

const SourceShowPage = () => {
  const { source, sourceError, dataProviders, dataProvidersError } =
    useLoaderData() as SourceShowPageLoaderReturnType;

  if (source == null) {
    let errorMessage =
      'An error occurred when we tried to find the chosen source.';
    if (typeof sourceError === 'string') errorMessage = sourceError;
    if (sourceError instanceof Error) errorMessage = sourceError.message;

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

  if (
    (source?.schedules ?? []).length === 1 &&
    (source.schedules[0]?.captures ?? []).length === 1
  ) {
    return (
      <Navigate
        to={`/captures/${source.schedules[0]?.captures[0]?.id}`}
        replace={true}
      />
    );
  }

  const sourceCapturesCount = useMemo(
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

  const amalgamatedCaptures = useMemo<[Schedule, Capture][]>(
    () =>
      source.schedules.reduce<[Schedule, Capture][]>(
        (carry, schedule) =>
          carry.concat(schedule.captures.map((capture) => [schedule, capture])),
        []
      ),
    [source]
  );
  const columnCount = 3;

  return (
    <>
      <div className="source-captures__source-domain">
        <div className="source-captures__source-domain__title">
          {source?.sourceDomain?.faviconImage != null &&
            source?.sourceDomain?.faviconImage !== '' && (
              <img
                src={source?.sourceDomain?.faviconImage ?? undefined}
                alt={source?.sourceDomain?.name}
              />
            )}
          <Text ellipsize>{sourceNameText}</Text>
        </div>
        <div className="source-captures__source-domain__url">
          {source?.url != null && (
            <CopyableExternalUrlLinkText url={source.url} />
          )}
        </div>
      </div>

      <div className="source-captures__provider-row">
        <img
          src={dataProvider?.iconInformation?.filePath}
          alt={dataProvider?.name}
          className={
            dataProvider.iconInformation.shouldInvertOnDarkMode
              ? 'source-captures__provider-row__image--invert'
              : ''
          }
        />
        <Text>{dataProvider?.name}</Text>
        <div className="source-captures__provider-row__schedule">
          {(source?.schedules ?? []).length > 0 && (
            <>
              <SourceIndexPageListItemCardScheduleCaption
                schedule={source.schedules[0]}
              />
              {(source.schedules ?? []).length >= 1 && (
                <SourceIndexPageChangeIntervalDropdownButton
                  source={source}
                  schedule={source.schedules[0]}
                />
              )}
            </>
          )}
        </div>
      </div>

      {sourceCapturesCount > 1 && (
        <div className="source-captures__buttons">
          <Text>
            {sourceCapturesCount} Source Save
            {sourceCapturesCount > 1 ? 's' : ''}
            <span className="source-captures__buttons__hint">
              Right-click a source's save to {/*edit or */}delete it.
            </span>
          </Text>
          {/* <Button intent="success" icon="add" text="Add a new Source" /> */}
        </div>
      )}

      <div className="source-captures__grid">
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              style={{ paddingBottom: '50px' }}
              width={width}
              height={height}
              rowCount={Math.ceil(
                (amalgamatedCaptures ?? []).length / columnCount
              )}
              rowHeight={560}
              columnCount={columnCount}
              columnWidth={width / columnCount - 10}
              cellRenderer={({ key, style, columnIndex, rowIndex }) => {
                const index = rowIndex * columnCount + columnIndex;
                if (index >= (amalgamatedCaptures ?? []).length) return null;

                return (
                  <div key={key} style={style}>
                    <SourceShowPageGridItemPreview
                      key={amalgamatedCaptures[index][1].id}
                      source={source}
                      schedule={amalgamatedCaptures[index][0]}
                      capture={amalgamatedCaptures[index][1]}
                      dataProvider={dataProvider}
                    />
                  </div>
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
};

export default SourceShowPage;
