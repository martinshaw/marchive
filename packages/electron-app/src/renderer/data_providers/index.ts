/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-12T00:53:26.348Z
Modified: 2023-09-12T00:53:26.348Z

Description: description
*/

import { ReactNode } from 'react';
import BlogArticleDataProviderRendererDetails from './BlogArticleDataProvider';
import WikipediaArticleDataProviderRendererDetails from './WikipediaArticleDataProvider';
import PodcastRssFeedDataProviderRendererDetails from './PodcastRssFeedDataProvider';
import SimpleWebpageScreenshotDataProviderRendererDetails from './SimpleWebpageScreenshotDataProvider';
import {
  CaptureEntityType,
  DataProviderSerializedType,
  ScheduleEntityType,
  SourceEntityType,
} from 'common-types';

export type DataProvidersRendererComponentCapturePreviewThumbnailPropsType = {
  source: SourceEntityType;
  schedule: ScheduleEntityType;
  capture: CaptureEntityType;
  dataProvider: DataProviderSerializedType;
};

export type DataProvidersRendererComponentCaptureShowPageFragmentPropsType = {
  source: SourceEntityType;
  schedule: ScheduleEntityType;
  capture: CaptureEntityType;
  dataProvider: DataProviderSerializedType;
};

export type DataProvidersRendererComponents = {
  capturePreviewThumbnail: (
    props: DataProvidersRendererComponentCapturePreviewThumbnailPropsType,
  ) => ReactNode;
  captureShowPageFragment: (
    props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType,
  ) => ReactNode;
};

export type DataProvidersRendererDetailsType = {
  components: DataProvidersRendererComponents;
};

const dataProvidersRendererDetailsList: {
  [identifier: string]: DataProvidersRendererDetailsType;
} = {
  'blog-article': BlogArticleDataProviderRendererDetails,
  'wikipedia-article': WikipediaArticleDataProviderRendererDetails,
  'podcast-rss-feed': PodcastRssFeedDataProviderRendererDetails,
  'simple-webpage-screenshot':
    SimpleWebpageScreenshotDataProviderRendererDetails,
};

export default dataProvidersRendererDetailsList;
