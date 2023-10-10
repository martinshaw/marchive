/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BlogArticleDataProviderCapturePartPreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { useMemo } from "react";
import { ReactNode } from "react";
import { Icon, IconSize, Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import { SourceAttributes } from "../../../../main/database/models/Source";
import { ScheduleAttributes } from "../../../../main/database/models/Schedule";
import { CaptureAttributes } from "../../../../main/database/models/Capture";
import { CapturePartAttributes } from "../../../../main/database/models/CapturePart";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider";
import useGetObjectFromJsonFile from "../../../../renderer/layouts/DefaultLayout/hooks/useGetObjectFromJsonFile";
import { useNavigate } from "react-router-dom";

import './index.scss'

export type DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  capturePart: CapturePartAttributes;
  dataProvider: DataProviderSerializedType
}

const BlogArticleDataProviderCapturePartPreviewThumbnail = (props: DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType) => {
  const navigate = useNavigate();

  const metadata = useGetObjectFromJsonFile({
    if: props.capturePart != null && props?.capturePart?.status === 'completed',
    filePath: 'marchive-downloads:///capture-part/'+props.capturePart.id + '/metadata.json',
  });

  const dateCaption = props?.capturePart?.createdAt == null ? null : useHumanDateCaption(props?.capturePart?.createdAt, true);

  const {
    titleElement,
    descriptionElement,
  } = useMemo<{
    titleElement: ReactNode | null,
    descriptionElement: ReactNode | null,
  }>(
    () => {
      if (metadata == null) return {
        titleElement: null,
        descriptionElement: null,
      }

      let titleText = (metadata?.title as string | null) || null;
      if (titleText?.includes(' - ')) {
        const titleTextParts = titleText.split(' - ');
        titleTextParts.pop()
        titleText = titleTextParts.join(' - ');
      }
      if (titleText?.includes(' | ')) {
        const titleTextParts = titleText.split(' | ');
        titleTextParts.pop()
        titleText = titleTextParts.join(' - ');
      }
      if (typeof titleText === 'string') titleText = titleText.trim();

      let descriptionText = (metadata?.description as string | null) || null;
      if (typeof descriptionText === 'string') descriptionText = descriptionText.trim();

      return {
        titleElement: titleText == null || titleText == '' ?
          null :
          <h1 className="blog-article-data-provider-capture-part-preview-thumbnail__details__title font-serif">{titleText}</h1>,
        descriptionElement: descriptionText == null || descriptionText == '' ?
          null :
          <p className="blog-article-data-provider-capture-part-preview-thumbnail__details__description font-serif">{descriptionText}</p>,
      }
    },
    [metadata]
  )

  // TODO: We need to implement functionality for the capture part to actually fail, and for the user to request for the capture part to be retried (reset status to pending)
  const failedCapturePart = (
    <div className="blog-article-data-provider-capture-part-preview-thumbnail__warning">
      <Icon icon="warning-sign" />
      <Text>Failed to save article or post: {props.capturePart.url} ...</Text>
    </div>
  );

  // TODO: We need to implement functionality for the capture part to actually be cancelled, and for the user to request for the capture part to be retried (reset status to pending)
  const cancelledCapturePart = (
    <div className="blog-article-data-provider-capture-part-preview-thumbnail__warning">
      <Icon icon="warning-sign" />
      <Text>Attempt to save article or post was cancelled: {props.capturePart.url} ...</Text>
    </div>
  );

  const pendingCapturePart = (
    <div className="blog-article-data-provider-capture-part-preview-thumbnail__warning">
      <Icon icon="time" />
      <Text>Queued to be saved soon: {props.capturePart.url} ...</Text>
    </div>
  );

  const processingCapturePart = (
    <div className="blog-article-data-provider-capture-part-preview-thumbnail__warning">
      <Spinner size={SpinnerSize.SMALL}/>
      <Text>Saving article or post: {props.capturePart.url} ...</Text>
    </div>
  );

  const captureMetadataNotFoundPart = (
    <div
      className="blog-article-data-provider-capture-part-preview-thumbnail__not-found"
      onClick={() => {
        navigate('/captures/'+props.capture.id+'?focused=capture-part:'+props.capturePart.id)
      }}
    >
      <Icon icon='diagnosis' size={IconSize.STANDARD}/>
      <Text>Metadata File is Missing: {props.capturePart.url}</Text>
    </div>
  );

  const completedCapturePart = (
    <div
      className="blog-article-data-provider-capture-part-preview-thumbnail__container"
      onClick={() => {
        navigate('/captures/'+props.capture.id+'?focused=capture-part:'+props.capturePart.id)
      }}
    >

      {/* <div className="blog-article-data-provider-capture-part-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div> */}

      <div className="blog-article-data-provider-capture-part-preview-thumbnail__details">
        {/* <Text ellipsize>Click to see this snapshot and its related pages</Text> */}
        {titleElement}
        {descriptionElement}
      </div>

    </div>
  );

  switch (props.capturePart.status) {
    case 'pending':
      return pendingCapturePart;
    case 'processing':
      return processingCapturePart;
    case 'completed':
      return metadata == null ? captureMetadataNotFoundPart : completedCapturePart;
    case 'failed':
      return failedCapturePart;
    case 'cancelled':
      return cancelledCapturePart;
    default:
      return null;
  }
}

export default BlogArticleDataProviderCapturePartPreviewThumbnail;
