/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, Text } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import useGetSources from './hooks/useGetSources';

import './index.scss';

const SourceIndexPage = () => {
  const {sources, errorMessage: listErrorMessage} = useGetSources();

  return (
    <>
      <div className="sources__buttons">
        <Text>
          {sources.length} Source{sources.length > 1 ? 's' : ''}
        </Text>
        <NavLink to="/sources/create">
          {() => (
            <Button intent="success" icon="add" text="Add a new Source" />
          )}
        </NavLink>
      </div>

      <div className="sources__list">
        {sources.map((source) => {
          if (source == null) return null;

          return (
            <Card
              key={source.id}
              className="sources__list__item"
            >
              <Text>{source.id}</Text>
              {/* <Icon icon={sourceProvider.icon} /> */}
              <Text>{source.dataProviderIdentifier}</Text>
              <Text>{source.url}</Text>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SourceIndexPage;
