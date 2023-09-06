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
import SourceIndexPageListItemCard from './components/SourceIndexPageListItemCard';
import getSourceDomains from './functions/getSourceDomains';
import getDataProviders from './functions/getDataProviders';
import { SourceDomainAttributes } from 'main/database/models/SourceDomain';

import './index.scss';
import { SourceAttributes } from 'main/database/models/Source';
import getSourcesWithoutSourceDomains from './functions/getSourcesWithoutSourceDomains';

type SourceIndexPageLoaderReturnType = {
  sourcesGroupedBySourceDomain: SourceDomainAttributes[],
  sourcesGroupedBySourceDomainError: Error | false,
  sourcesWithoutSourceDomain: SourceAttributes[],
  sourcesWithoutSourceDomainError: Error | false,
  dataProviders: DataProviderSerializedType[],
  dataProvidersError: Error | false,
}

export const SourceIndexPageLoader = async (): Promise<SourceIndexPageLoaderReturnType> => {
  let sourcesGroupedBySourceDomain: SourceDomainAttributes[] = [];
  let sourcesGroupedBySourceDomainError: Error | false = false;

  try { sourcesGroupedBySourceDomain = await getSourceDomains(true, true); }
  catch (error) { sourcesGroupedBySourceDomainError = error as Error; }

  let sourcesWithoutSourceDomain: SourceAttributes[] = [];
  let sourcesWithoutSourceDomainError: Error | false = false;

  try { sourcesWithoutSourceDomain = await getSourcesWithoutSourceDomains(); }
  catch (error) { sourcesWithoutSourceDomainError = error as Error; }

  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersError: Error | false = false;

  try { dataProviders = await getDataProviders(); }
  catch (error) { dataProvidersError = error as Error; }

  return {
    sourcesGroupedBySourceDomain,
    sourcesGroupedBySourceDomainError,
    sourcesWithoutSourceDomain,
    sourcesWithoutSourceDomainError,
    dataProviders,
    dataProvidersError,
  }
}

const SourceIndexPage = () => {
  const {
    sourcesGroupedBySourceDomain,
    sourcesGroupedBySourceDomainError,
    sourcesWithoutSourceDomain,
    sourcesWithoutSourceDomainError,
    dataProviders,
    dataProvidersError
  } = useLoaderData() as SourceIndexPageLoaderReturnType

  const sourcesCount = useMemo(
    () => sourcesGroupedBySourceDomain == null ?
      0 :
      sourcesGroupedBySourceDomain.reduce((c, sourceDomain) => (c + (sourceDomain.sources ?? []).length), 0)
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
        {(sourcesGroupedBySourceDomain ?? []).map(sourceDomain =>
          <div key={sourceDomain.id} className="sources__list__source-domain">
            <div className="sources__list__source-domain__title">
              {sourceDomain.faviconImage != null && sourceDomain.faviconImage !== '' && <img src={sourceDomain.faviconImage ?? undefined} alt={sourceDomain.name} /> }
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
        )}

        {(sourcesWithoutSourceDomain ?? []).map(source => (
          source == null ? null :
            <SourceIndexPageListItemCard
              key={source.id}
              source={source}
              dataProviders={dataProviders}
            />
        ))}
      </div>
    </>
  );
};

export default SourceIndexPage;
