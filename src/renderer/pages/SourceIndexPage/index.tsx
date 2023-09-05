/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { useMemo, useState } from 'react';
import { Button, Text } from '@blueprintjs/core';
import { NavLink, useLoaderData } from 'react-router-dom';
import { DataProviderSerializedType } from '../../../main/app/data_providers/BaseDataProvider';
import { SourceAttributes } from '../../../main/database/models/Source';
import SourceIndexPageListItemCard from './components/SourceIndexPageListItemCard';
import getSourceDomains from './functions/getSourceDomains';
import getDataProviders from './functions/getDataProviders';

import './index.scss';
import { SourceDomainAttributes } from 'main/database/models/SourceDomain';

type SourceIndexPageLoaderReturnType = {
  sourcesGroupedBySourceDomain: SourceDomainAttributes[],
  sourcesGroupedBySourceDomainErrorMessage: string | false,
  dataProviders: DataProviderSerializedType[],
  dataProvidersErrorMessage: string | false,
}

export const SourceIndexPageLoader = async (): Promise<SourceIndexPageLoaderReturnType> => {
  let sourcesGroupedBySourceDomain: SourceDomainAttributes[] = [];
  let sourcesGroupedBySourceDomainErrorMessage: string | false = false;
  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersErrorMessage: string | false = false;

  try { sourcesGroupedBySourceDomain = await getSourceDomains(true); }
  catch (errorMessage) { sourcesGroupedBySourceDomainErrorMessage = errorMessage as string; }

  try { dataProviders = await getDataProviders(); }
  catch (errorMessage) { dataProvidersErrorMessage = errorMessage as string; }

  return {
    sourcesGroupedBySourceDomain,
    sourcesGroupedBySourceDomainErrorMessage,
    dataProviders,
    dataProvidersErrorMessage,
  }
}

const SourceIndexPage = () => {
  const {
    sourcesGroupedBySourceDomain,
    sourcesGroupedBySourceDomainErrorMessage,
    dataProviders,
    dataProvidersErrorMessage
  } = useLoaderData() as SourceIndexPageLoaderReturnType

  const sourcesCount = useMemo(
    () => sourcesGroupedBySourceDomain == null ?
      0 :
      sourcesGroupedBySourceDomain.reduce((c, sourceDomain) => (c + sourceDomain.sources.length), 0)
    ,
    [sourcesGroupedBySourceDomain]
  )

  return (
    <>
      <div className="sources__buttons">
        <Text>
          {sourcesCount} Source{sourcesCount > 1 ? 's' : ''}
          <span className="sources__buttons__hint">
            Right-click a source to edit or delete it.
          </span>
        </Text>
        <NavLink to="/sources/create">
          {() => (
            <Button intent="success" icon="add" text="Add a new Source" />
          )}
        </NavLink>
      </div>

      <div className="sources__list">
        {/* {sourcesGroupedBySourceDomain.map(sourceDomain =>
          <div key={sourceDomain.id} className="sources__list__source-domain">
            <div className="sources__list__source-domain__title">
              <img src={sourceDomain.faviconPath ?? undefined} alt={sourceDomain.name} />
              <Text ellipsize>{sourceDomain.name}</Text>
            </div>

            {(sourceDomain.sources ?? []).map(source => (
              source == null ? null :
                <SourceIndexPageListItemCard
                  key={source.id}
                  source={source}
                  dataProviders={dataProviders}
                />
            ))}
          </div>
        )} */}
      </div>
    </>
  );
};

export default SourceIndexPage;
