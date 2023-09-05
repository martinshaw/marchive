/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePageDataProviderOptionsGrid.tsx
Created:  2023-09-01T01:56:02.501Z
Modified: 2023-09-01T01:56:02.501Z

Description: description
*/

import { Card, Text } from "@blueprintjs/core"
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider"
import { useState } from "react"

export type SourceCreatePageDataProviderOptionsGridPropsType = {
  dataProviders: DataProviderSerializedType[]
  isInteractive: boolean
  onDataProviderOptionSelected: (dataProvider: DataProviderSerializedType) => void
}

const SourceCreatePageDataProviderOptionsGrid = (props: SourceCreatePageDataProviderOptionsGridPropsType) => {
  const [hoveredProviderGridItem, setHoveredProviderGridItem] = useState<DataProviderSerializedType | null>(null)

  return (
    <>
      <div className="data-providers__grid">
        {props.dataProviders.map((dataProvider) => {
          if (dataProvider == null) return null

          return (
            <Card
              key={dataProvider.identifier}
              interactive={props.isInteractive}
              className="data-providers__grid__item"
              onClick={() => props.onDataProviderOptionSelected(dataProvider)}
              onMouseEnter={() => setHoveredProviderGridItem(dataProvider)}
              onMouseLeave={() => setHoveredProviderGridItem(null)}
            >
              <img src={dataProvider.iconInformation.filePath} className={dataProvider.iconInformation.shouldInvertOnDarkMode ? 'data-providers__grid__item__image--invert' : ''} />
              <Text>{dataProvider.name}</Text>
            </Card>
          )
        })}
      </div>

      <div className="data-providers__description">
        <Text>
          {hoveredProviderGridItem != null ? hoveredProviderGridItem.description : ''}
        </Text>
      </div>
    </>
  )
}

export default SourceCreatePageDataProviderOptionsGrid
