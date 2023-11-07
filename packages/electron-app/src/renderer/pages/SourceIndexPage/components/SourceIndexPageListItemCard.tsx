/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageListItemCard.tsx
Created:  2023-08-31T16:13:47.844Z
Modified: 2023-08-31T16:13:47.844Z

Description: description
*/

import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Text } from '@blueprintjs/core';
import { SourceAttributes } from 'database/src/models/Source';
import { DataProviderSerializedType } from "data-providers/src/BaseDataProvider";
import SourceIndexPageListItemCardScheduleCaption from './SourceIndexPageListItemCardScheduleCaption';

export type SourceIndexPageListItemCardPropsType = {
  source: SourceAttributes;
  dataProviders: DataProviderSerializedType[];
};

const SourceIndexPageListItemCard = (
  props: SourceIndexPageListItemCardPropsType
) => {
  const dataProvider: DataProviderSerializedType | null =
    props.dataProviders.find(
      (dataProvider) =>
        dataProvider.identifier === props.source.dataProviderIdentifier
    ) || null;

  const hasNotFinishedProcessingFirstCapture: boolean = (() => {
    // Sources will always have at least one schedule, and if they don't, they will need to be able to
    //   access SourceShowPage to make changes
    if (props.source.schedules.length === 0) return false;
    return props.source.schedules[0].lastRunAt == null;
  })();

  let nameAndUrlCaption: ReactNode | string = props.source.url;
  if (props.source.name != null) nameAndUrlCaption = <>{props.source.name} <span>{nameAndUrlCaption}</span></>;

  return (
    <NavLink
      to={hasNotFinishedProcessingFirstCapture ? '' : `/sources/${props.source.id}`}
      className="sources__list__item__link"
    >
      <Card
        key={props.source.id}
        className="sources__list__item"
        interactive={hasNotFinishedProcessingFirstCapture === false}
      >
        <div className="sources__list__item__details-row">
          <Text>{nameAndUrlCaption}</Text>
        </div>
        {dataProvider != null && (
          <div className="sources__list__item__provider-row">
            <img
              src={dataProvider?.iconInformation?.filePath}
              alt={dataProvider?.name}
              className={
                dataProvider.iconInformation.shouldInvertOnDarkMode
                  ? 'sources__list__item__image--invert'
                  : ''
              }
            />
            <Text>{dataProvider?.name}</Text>
            <div className="sources__list__item__provider-row__schedule">
              {(props.source?.schedules ?? []).length > 0 && <SourceIndexPageListItemCardScheduleCaption
                schedule={props.source.schedules[0]}
              />}
            </div>
          </div>
        )}
      </Card>
    </NavLink>
  );
};

export default SourceIndexPageListItemCard;
