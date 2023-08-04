/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourcesIndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, Text } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import useGetSources from './hooks/useGetSources';
import useGetSourceProviders from '../SourcesCreatePage/hooks/useGetSourceProviders';

import './index.scss';

const SourcesIndexPage = () => {
  const sources = useGetSources();
  const sourceProviders = useGetSourceProviders();

  return (
    <>
      <div className="sources__buttons">
        <Text>
          {sources.length} Source{sources.length > 1 ? 's' : ''}
        </Text>
        <NavLink to="/sources/create">
          {() => <Button intent="success" icon="add" text="Add a new Source" />}
        </NavLink>
      </div>

      <div className="sources__list">
        {sources.map((source) => {
          if (source == null) return null;

          const sourceProvider = sourceProviders.find(
            (currentSourceProvider) =>
              currentSourceProvider.identifier ===
              source.dataValues.source_provider_identifier
          );

          if (sourceProvider == null) return null;

          return (
            <Card key={source.dataValues.id} className="source__list__item">
              <Text>{source.dataValues.id}</Text>
              <Icon icon={sourceProvider.icon} />
              <Text>{sourceProvider.name}</Text>
              <Text>{source.dataValues.url}</Text>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SourcesIndexPage;
