/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleIndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, Text } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
// import useGetSources from './hooks/useGetSources';
import useGetSourceProviders from '../ScheduleCreateSourcePage/hooks/useGetSourceProviders';

import './index.scss';

const ScheduleIndexPage = () => {
  // const sources = useGetSources();
  const sourceProviders = useGetSourceProviders();
  const schedules: any[] = [];

  return (
    <>
      <div className="schedules__buttons">
        <Text>
          {schedules.length} Schedule{schedules.length > 1 ? 's' : ''}
        </Text>
        <NavLink to="/schedules/create/source">
          {() => (
            <Button intent="success" icon="add" text="Add a new Schedule" />
          )}
        </NavLink>
      </div>

      <div className="schedules__list">
        {schedules.map((schedule) => {
          if (schedule == null) return null;

          const sourceProvider = sourceProviders.find(
            (currentSourceProvider) =>
              currentSourceProvider.identifier ===
              schedule.source.dataValues.source_provider_identifier
          );

          if (sourceProvider == null) return null;

          return (
            <Card
              key={schedule.dataValues.id}
              className="schedules__list__item"
            >
              <Text>{schedule.dataValues.id}</Text>
              <Icon icon={sourceProvider.icon} />
              <Text>{sourceProvider.name}</Text>
              <Text>{schedule.source.dataValues.url}</Text>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default ScheduleIndexPage;
