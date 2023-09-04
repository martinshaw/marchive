/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePageExampleSourceGalleryGridItem.tsx
Created:  2023-09-01T02:44:41.725Z
Modified: 2023-09-01T02:44:41.725Z

Description: description
*/

import { Card, Text } from "@blueprintjs/core"
import { GalleryExampleSourceItemType } from "./SourceCreatePageExampleSourceGallery"
import { MouseEventHandler } from "react"

export type SourceCreatePageExampleSourceGalleryGridItemPropsType = GalleryExampleSourceItemType & {
  useNotHoveredEffect: boolean,
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
  onExampleSourceSelected: (url: string, dataProviderIdentifier: string) => void,
}

const SourceCreatePageExampleSourceGalleryGridItem = (props: SourceCreatePageExampleSourceGalleryGridItemPropsType) => {
  const hoverClassName = 'data-providers__gallery__item' + (props.useNotHoveredEffect ? '--not-hover' : '')

  return (
    <Card
      interactive
      className={"data-providers__gallery__item " + hoverClassName}
      onClick={() => props.onExampleSourceSelected(props.url, props.dataProviderIdentifier)}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <img src={props.iconInformation.filePath} className={props.iconInformation.shouldInvertOnDarkMode ? 'data-providers__gallery__item__image--invert' : ''} />
      <Text>{props.caption}</Text>
    </Card>
  )
}

export default SourceCreatePageExampleSourceGalleryGridItem
