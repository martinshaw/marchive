/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { useState } from 'react';
import { Button, Text } from '@blueprintjs/core';
import { NavLink, useLoaderData } from 'react-router-dom';
import { DataProviderSerializedType } from '../../../main/app/data_providers/BaseDataProvider';
import { SourceAttributes } from '../../../main/database/models/Source';
import SourceIndexPageListItemCard from './components/SourceIndexPageListItemCard';
import getSources from './functions/getSources';
import getDataProviders from './functions/getDataProviders';

import './index.scss';

type SourceIndexPageLoaderReturnType = {
  sources: SourceAttributes[],
  sourcesErrorMessage: string | false,
  dataProviders: DataProviderSerializedType[],
  dataProvidersErrorMessage: string | false,
}

export const SourceIndexPageLoader = async (): Promise<SourceIndexPageLoaderReturnType> => {
  let sources: SourceAttributes[] = [];
  let sourcesErrorMessage: string | false = false;
  let dataProviders: DataProviderSerializedType[] = [];
  let dataProvidersErrorMessage: string | false = false;

  try { sources = await getSources(); }
  catch (errorMessage) { sourcesErrorMessage = errorMessage as string; }

  try { dataProviders = await getDataProviders(); }
  catch (errorMessage) { dataProvidersErrorMessage = errorMessage as string; }

  return {
    sources,
    sourcesErrorMessage,
    dataProviders,
    dataProvidersErrorMessage,
  }
}

const SourceIndexPage = () => {
  const { sources, sourcesErrorMessage, dataProviders, dataProvidersErrorMessage } = useLoaderData() as SourceIndexPageLoaderReturnType

  const [hoveredSourceListItem, setHoveredSourceListItem] = useState<SourceAttributes | null>(null)

  return (
    <>
      <div className="sources__buttons">
        <Text>
          {sources.length} Source{sources.length > 1 ? 's' : ''}
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
        {sources.map(source => (
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
