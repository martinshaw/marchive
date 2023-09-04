/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageListItemCard.tsx
Created:  2023-08-31T16:13:47.844Z
Modified: 2023-08-31T16:13:47.844Z

Description: description
*/

import { Card, Icon, Text } from "@blueprintjs/core";
import { DataProviderSerializedType } from "main/app/providers/BaseDataProvider";
import { SourceAttributes } from "main/database/models/Source";
import { MouseEventHandler, ReactNode } from "react";

export type SourceIndexPageListItemCardPropsType = {
  source: SourceAttributes,
  dataProviders: DataProviderSerializedType[],
  useNotHoveredEffect: boolean,
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
}

const SourceIndexPageListItemCard = (props: SourceIndexPageListItemCardPropsType) => {
  const dataProvider: DataProviderSerializedType | null = props.dataProviders.find(
    dataProvider => dataProvider.identifier === props.source.dataProviderIdentifier
  ) || null;

  const hoverClassName = 'sources__list__item' + (props.useNotHoveredEffect ? '--not-hover' : '')

  let scheduleCaption: ReactNode = null;
  if (props.source.schedules.length > 1) {
    scheduleCaption = (
      <>
        <Icon icon="time" />
        <Text>{props.source.schedules.length} schedules</Text>
      </>
    );
  }
  else if (props.source.schedules.length === 1) {
    if (props.source.schedules[0].status === 'pending') {
      if (props.source.schedules[0].interval == null) {
        if (props.source.schedules[0].lastRunAt == null && props.source.schedules[0].nextRunAt == null) {
          scheduleCaption = (
            <>
              <Icon icon="time" />
              <Text>Not scheduled to run</Text>
            </>
          );
        }
        else if (props.source.schedules[0].lastRunAt != null && props.source.schedules[0].nextRunAt == null) {
          scheduleCaption = (
            <>
              <Icon icon="time" />
              <Text>Ran on {props.source.schedules[0].lastRunAt.toDateString()} {props.source.schedules[0].lastRunAt.toLocaleTimeString()}</Text>
            </>
          );
        }
        else if (props.source.schedules[0].lastRunAt == null && props.source.schedules[0].nextRunAt != null) {
          scheduleCaption = (
            <>
              <Icon icon="time" />
              <Text>Will run on {props.source.schedules[0].nextRunAt.toDateString()} {props.source.schedules[0].nextRunAt.toLocaleTimeString()}</Text>
            </>
          );
        }
      }
      else {
        const nextCaption = props.source.schedules[0].nextRunAt != null ? `(next time on ${props.source.schedules[0].nextRunAt.toDateString()} ${props.source.schedules[0].nextRunAt.toLocaleTimeString()})` : '';
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Runs every {Math.ceil(props.source.schedules[0].interval / 60)} mins. {nextCaption}</Text>
          </>
        );
      }
    }
    else if (props.source.schedules[0].status === 'processing') {
      scheduleCaption = (
        <>
          <Icon icon="time" />
          <Text>Running now...</Text>
        </>
      );
    }
  }

  return (
    <Card
      key={props.source.id}
      className={"sources__list__item " + hoverClassName}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {dataProvider != null && (
        <div className="sources__list__item__provider-row">
          <img src={dataProvider?.iconInformation?.filePath} alt={dataProvider?.name} className={dataProvider.iconInformation.shouldInvertOnDarkMode ? 'sources__list__item__image--invert' : ''} />
          <Text>{dataProvider?.name}</Text>
          <div className="sources__list__item__provider-row__schedule">{scheduleCaption}</div>
        </div>
      )}
      <div className="sources__list__item__details-row">
        <Text>{props.source.url}</Text>
      </div>
    </Card>
  );
}

export default SourceIndexPageListItemCard;
