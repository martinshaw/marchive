/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-12T00:53:26.348Z
Modified: 2023-09-12T00:53:26.348Z

Description: description
*/

import { ReactNode } from "react";
import { SourceAttributes } from "../../main/database/models/Source";
import { ScheduleAttributes } from "../../main/database/models/Schedule";
import { CaptureAttributes } from "../../main/database/models/Capture";
import { CapturePartAttributes } from "../../main/database/models/CapturePart";
import { DataProviderSerializedType } from "../../main/app/data_providers/BaseDataProvider";
import BlogArticleDataProviderRendererDetails from './BlogArticleDataProvider'

export type DataProvidersRendererComponentCapturePreviewThumbnailPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  dataProvider: DataProviderSerializedType
}

export type DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  capturePart: CapturePartAttributes;
  dataProvider: DataProviderSerializedType
}

export type DataProvidersRendererComponents = {
  capturePreviewThumbnail: (props: DataProvidersRendererComponentCapturePreviewThumbnailPropsType) => ReactNode;
  capturePartPreviewThumbnail: (props: DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType) => ReactNode;
}

export type DataProvidersRendererDetailsType = {
  components: DataProvidersRendererComponents;
}

const dataProvidersRendererDetailsList: {[identifier: string]: DataProvidersRendererDetailsType} = {
  'blog-article': BlogArticleDataProviderRendererDetails,
}

export default dataProvidersRendererDetailsList;