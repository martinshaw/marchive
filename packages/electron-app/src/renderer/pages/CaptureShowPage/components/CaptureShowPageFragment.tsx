/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowPageFragment.tsx
Created:  2023-09-11T13:04:19.598Z
Modified: 2023-09-11T13:04:19.598Z

Description: description
*/

import { useMemo, ReactNode } from "react";
import { SourceAttributes } from "database/src/models/Source";
import { CaptureAttributes } from "database/src/models/Capture";
import { ScheduleAttributes } from "database/src/models/Schedule";
import dataProvidersRendererDetailsList from "../../../data_providers";
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider";

export type CaptureShowPageFragmentPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  dataProvider: DataProviderSerializedType;
}

const CaptureShowPageFragment = (props: CaptureShowPageFragmentPropsType) => {
  const capturePartPreviewThumbnailComponent = useMemo<ReactNode | null>(() => {
    if (!props.source.dataProviderIdentifier) return null;
    if (typeof dataProvidersRendererDetailsList[props.source.dataProviderIdentifier] === 'undefined') return null;

    const dataProviderRendererDetails = dataProvidersRendererDetailsList[props.source.dataProviderIdentifier];
    if (dataProviderRendererDetails?.components?.captureShowPageFragment == null) return null;

    return dataProviderRendererDetails.components.captureShowPageFragment({
      source: props.source,
      schedule: props.schedule,
      capture: props.capture,
      dataProvider: props.dataProvider,
    });
  }, [props.source, props.schedule, props.capture])

  return capturePartPreviewThumbnailComponent
}

export default CaptureShowPageFragment;
