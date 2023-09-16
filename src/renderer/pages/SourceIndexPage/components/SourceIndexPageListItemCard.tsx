/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageListItemCard.tsx
Created:  2023-08-31T16:13:47.844Z
Modified: 2023-08-31T16:13:47.844Z

Description: description
*/

import { ReactNode } from "react";
import { Card, Icon, Text } from "@blueprintjs/core";
import { SourceAttributes } from "../../../../main/database/models/Source";
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider";
import SourceIndexPageListItemCardScheduleCaption from "./SourceIndexPageListItemCardScheduleCaption";
import { NavLink } from "react-router-dom";

export type SourceIndexPageListItemCardPropsType = {
  source: SourceAttributes,
  dataProviders: DataProviderSerializedType[],
}

const SourceIndexPageListItemCard = (props: SourceIndexPageListItemCardPropsType) => {
  const dataProvider: DataProviderSerializedType | null = props.dataProviders.find(
    dataProvider => dataProvider.identifier === props.source.dataProviderIdentifier
  ) || null;

  return (
    <NavLink to={`/sources/${props.source.id}`} className="sources__list__item__link">
      <Card key={props.source.id} className="sources__list__item" interactive>
        {dataProvider != null && (
          <div className="sources__list__item__provider-row">
            <img src={dataProvider?.iconInformation?.filePath} alt={dataProvider?.name} className={dataProvider.iconInformation.shouldInvertOnDarkMode ? 'sources__list__item__image--invert' : ''} />
            <Text>{dataProvider?.name}</Text>
            <div className="sources__list__item__provider-row__schedule">
              <SourceIndexPageListItemCardScheduleCaption source={props.source} />
            </div>
          </div>
        )}
        <div className="sources__list__item__details-row">
          <Text>{props.source.url}</Text>
        </div>
      </Card>
    </NavLink>
  );
}

export default SourceIndexPageListItemCard;
