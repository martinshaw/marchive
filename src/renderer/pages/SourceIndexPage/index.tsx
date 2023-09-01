/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, Text } from '@blueprintjs/core';
import { NavLink, useLoaderData } from 'react-router-dom';
import useGetSources from './hooks/useGetSources';
import useGetDataProviders from './hooks/useGetDataProviders';
import { DataProviderSerializedType } from 'main/app/providers/BaseDataProvider';

import './index.scss';
import { ReactNode, useRef, useState } from 'react';
import { SourceAttributes } from 'main/database/models/Source';
import SourceIndexPageListItemCard from './components/SourceIndexPageListItemCard';
import { List, ListRowRenderer } from 'react-virtualized';

/**
 * TODO: We should probably migrate to using React Dom Router's loader functionality, but this would require rewriting
 *   and refactoring the custom hooks which call and wait for response from IPC channels.
 *
 * Doing so would improve responsiveness - when a form is submitted, the data would change.
 *
 * We would need to return promises which resolve when we get an IPC channel reply
 */

// type SourceIndexPageLoaderReturnType = {
//   sources: SourceAttributes[],
//   sourcesErrorMessage: string | false,
//   dataProviders: DataProviderSerializedType[],
//   dataProvidersErrorMessage: string | false,
// }

// export const SourceIndexPageLoader = async (): Promise<SourceIndexPageLoaderReturnType> => {
//   const {sources, errorMessage: sourcesErrorMessage} = useGetSources();
//   const {dataProviders, errorMessage: dataProvidersErrorMessage} = useGetDataProviders();

//   return {
//     sources,
//     sourcesErrorMessage,
//     dataProviders,
//     dataProvidersErrorMessage,
//   }
// }

const SourceIndexPage = () => {
  // const { sources, sourcesErrorMessage, dataProviders, dataProvidersErrorMessage } = useLoaderData() as SourceIndexPageLoaderReturnType

  const { sources, errorMessage: sourcesErrorMessage } = useGetSources();
  const { dataProviders, errorMessage: dataProvidersErrorMessage } = useGetDataProviders();

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
              useNotHoveredEffect={hoveredSourceListItem != null && hoveredSourceListItem.id !== source.id}
              onMouseEnter={() => setHoveredSourceListItem(source)}
              onMouseLeave={() => setHoveredSourceListItem(null)}
            />
        ))}
      </div>
    </>
  );
};

export default SourceIndexPage;
