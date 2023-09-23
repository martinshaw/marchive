/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: PodcastRssFeedDataProviderCapturePartPreviewThumbnail.tsx
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
import useHumanDateCaption from "../../hooks/useHumanDateCaption";
import { DataProviderSerializedType } from "../../../../main/app/data_providers/BaseDataProvider";
import useGetObjectFromJsonFile from "../../../layouts/DefaultLayout/hooks/useGetObjectFromJsonFile";
import { useNavigate } from "react-router-dom";
import { PodcastRssFeedDataProviderPartPayloadType } from "main/app/data_providers/PodcastRssFeedDataProvider";
// @ts-ignore
import sanitizeHtml from 'sanitize-html';

import './index.scss'

export type DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  capturePart: CapturePartAttributes;
  dataProvider: DataProviderSerializedType
}

const PodcastRssFeedDataProviderCapturePartPreviewThumbnail = (props: DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType) => {
  const navigate = useNavigate();

  let metadata = (
    useGetObjectFromJsonFile({
      if: props.capturePart != null && props?.capturePart?.status === 'completed',
      filePath: 'marchive-downloads:///capture-part/'+props.capturePart.id + '/metadata.json',
    }) || JSON.parse(props.capturePart.payload)
  ) as PodcastRssFeedDataProviderPartPayloadType | null;

  const dateCaption = props?.capturePart?.createdAt == null ? null : useHumanDateCaption(props?.capturePart?.createdAt);

  const {
    titleElement,
    contentElement,
    dateElement,
  } = useMemo<{
    titleElement: ReactNode | null,
    contentElement: ReactNode | null,
    dateElement: ReactNode | null,
  }>(
    () => {
      const returnValue =  {
        titleElement: null,
        contentElement: null,
        dateElement: null,
      };

      if (metadata == null) return returnValue;

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

      let contentHtmlUnsafe = (metadata?.content as string | null) || null;
      if (typeof contentHtmlUnsafe === 'string') contentHtmlUnsafe = contentHtmlUnsafe.trim();
      if (contentHtmlUnsafe == null || contentHtmlUnsafe == '') return returnValue;

      const contentHtml = sanitizeHtml(contentHtmlUnsafe);

      let dateCaption: string | null = null;
      if (metadata?.pubDate != null) {
        dateCaption = useHumanDateCaption(new Date(metadata?.pubDate), false);
      }

      return {
        titleElement: titleText == null || titleText == '' ?
          null :
          <h1 className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__details__title font-serif">{titleText}</h1>,
        contentElement: contentHtml == null || contentHtml == '' ?
          null :
          <p className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__details__content font-serif" dangerouslySetInnerHTML={{__html: contentHtml}}></p>,
        dateElement: dateCaption == null || dateCaption == '' ?
          null :
          <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__details__date">
            {dateCaption}
          </div>,
      }
    },
    [metadata]
  )

  // TODO: We need to implement functionality for the capture part to actually fail, and for the user to request for the capture part to be retried (reset status to pending)
  const failedCapturePart = (
    <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__warning">
      <Icon icon="warning-sign" />
      <Text>Failed to save episode: {props.capturePart.url} ...</Text>
    </div>
  );

  // TODO: We need to implement functionality for the capture part to actually be cancelled, and for the user to request for the capture part to be retried (reset status to pending)
  const cancelledCapturePart = (
    <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__warning">
      <Icon icon="warning-sign" />
      <Text>Attempt to save episode was cancelled: {props.capturePart.url} ...</Text>
    </div>
  );

  const pendingCapturePart = (
    <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__warning">
      <Icon icon="time" />
      <Text>Queued to be saved soon: {props.capturePart.url} ...</Text>
    </div>
  );

  const processingCapturePart = (
    <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__warning">
      <Spinner size={SpinnerSize.SMALL}/>
      <Text>Saving episode: {props.capturePart.url} ...</Text>
    </div>
  );

  const captureMetadataNotFoundPart = (
    <div
      className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__not-found"
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
      className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__container"
      onClick={() => {
        navigate('/captures/'+props.capture.id+'?focused=capture-part:'+props.capturePart.id)
      }}
    >

      {/* <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div> */}

      <div className="podcast-rss-feed-data-provider-capture-part-preview-thumbnail__details">
        {/* <Text ellipsize>Click to see this snapshot and its related pages</Text> */}
        {titleElement}
        {contentElement}
        {dateElement}
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

export default PodcastRssFeedDataProviderCapturePartPreviewThumbnail;
