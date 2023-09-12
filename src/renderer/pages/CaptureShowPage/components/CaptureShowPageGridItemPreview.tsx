/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowPageGridItemPreview.tsx
Created:  2023-09-11T13:04:19.598Z
Modified: 2023-09-11T13:04:19.598Z

Description: description
*/

import { useMemo } from "react";
import { ReactNode } from "react";
import { SourceAttributes } from "../../../../main/database/models/Source";
import { ScheduleAttributes } from "../../../../main/database/models/Schedule";
import { CaptureAttributes } from "../../../../main/database/models/Capture";
import { CapturePartAttributes } from "../../../../main/database/models/CapturePart";
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider";
import dataProvidersRendererDetailsList from "../../../../renderer/data_providers";

export type CaptureShowPageGridItemPreviewPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  capturePart: CapturePartAttributes
  dataProvider: DataProviderSerializedType;
}

const CaptureShowPageGridItemPreview = (props: CaptureShowPageGridItemPreviewPropsType) => {
  const capturePartPreviewThumbnailComponent = useMemo<ReactNode | null>(() => {
    if (!props.source.dataProviderIdentifier) return null;
    if (typeof dataProvidersRendererDetailsList[props.source.dataProviderIdentifier] === 'undefined') return null;

    const dataProviderRendererDetails = dataProvidersRendererDetailsList[props.source.dataProviderIdentifier];
    if (dataProviderRendererDetails?.components?.capturePartPreviewThumbnail == null) return null;

    return dataProviderRendererDetails.components.capturePartPreviewThumbnail({
      source: props.source,
      schedule: props.schedule,
      capture: props.capture,
      capturePart: props.capturePart,
      dataProvider: props.dataProvider,
    });
  }, [props.source, props.schedule, props.capture])

  return capturePartPreviewThumbnailComponent
}

export default CaptureShowPageGridItemPreview;
