/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowPageGridItemPreview.tsx
Created:  2023-09-11T13:04:19.598Z
Modified: 2023-09-11T13:04:19.598Z

Description: description
*/

import { useMemo } from "react";
import { ReactNode } from "react";
import dataProvidersRendererDetailsList from "renderer/data_providers";
import { SourceAttributes } from "../../../../main/database/models/Source";
import { CaptureAttributes } from "../../../../main/database/models/Capture";
import { ScheduleAttributes } from "../../../../main/database/models/Schedule";
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider";

export type SourceShowPageGridItemPreviewPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  dataProvider: DataProviderSerializedType;
}

const SourceShowPageGridItemPreview = (props: SourceShowPageGridItemPreviewPropsType) => {
  const capturePreviewThumbnailComponent = useMemo<ReactNode | null>(() => {
    if (!props.source.dataProviderIdentifier) return null;
    if (typeof dataProvidersRendererDetailsList[props.source.dataProviderIdentifier] === 'undefined') return null;

    const dataProviderRendererDetails = dataProvidersRendererDetailsList[props.source.dataProviderIdentifier];
    if (dataProviderRendererDetails?.components?.capturePreviewThumbnail == null) return null;

    return dataProviderRendererDetails.components.capturePreviewThumbnail({
      source: props.source,
      schedule: props.schedule,
      capture: props.capture,
      dataProvider: props.dataProvider,
    });
  }, [props.source, props.schedule, props.capture])

  return capturePreviewThumbnailComponent
}

export default SourceShowPageGridItemPreview;
