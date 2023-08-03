/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourcesPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Button, Card, Icon, InputGroup, Text } from '@blueprintjs/core';
import { ChangeEvent } from 'react';

import useGetSourceProviders from './hooks/useGetSourceProviders';
import './index.scss';

const SourcesPage = () => {
  const sourceProviders = useGetSourceProviders();

  const validateInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('event', event, event.target.value);
  };

  const submitNewSourceOnClick = () => {
    console.log('submitNewSourceOnClick');
  };

  return (
    <>
      <div className="source-providers__input">
        <InputGroup
          fill
          leftIcon="search"
          placeholder="Enter the address of a blog, gallery, RSS feed etc..."
          onChange={validateInputOnChange}
          tabIndex={0}
          inputRef={(ref) => ref?.focus()}
        />
        <Button
          icon="add"
          text="&nbsp;Add&nbsp;a&nbsp;new&nbsp;Source&nbsp;"
          onClick={submitNewSourceOnClick}
          tabIndex={0}
        />
      </div>

      <div className="source-providers__grid">
        {sourceProviders.map((sourceProvider) => {
          if (sourceProvider == null) return null;

          return (
            <Card
              key={sourceProvider.identifier}
              className="source-providers__grid__item"
            >
              <Icon icon={sourceProvider.icon} />
              <Text>{sourceProvider.name}</Text>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SourcesPage;
