/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BlogArticleDataProviderCapturePartPreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { Icon, Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import { DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType } from "../..";
import useGetImageFromCaptureDirectory from "../../hooks/useGetImageFromCaptureDirectory";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";

import './index.scss'
import useGetTextFromCapturePartDirectory from "renderer/data_providers/hooks/useGetTextFromCapturePartDirectory";
import { JSONObject } from "types-json";
import { ReactNode } from "react";
import { useMemo } from "react";

const BlogArticleDataProviderCapturePartPreviewThumbnail = (props: DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType) => {
  const {
    text,
    fullPath,
    errorMessage,
  } = useGetTextFromCapturePartDirectory({
    capturePart: props.capturePart,
    path: 'metadata.json'
  });

  const dateCaption = props?.capturePart?.createdAt == null ? null : useHumanDateCaption(props?.capturePart?.createdAt);

  const {
    titleElement,
    descriptionElement,
  } = useMemo<{
    titleElement: ReactNode | null,
    descriptionElement: ReactNode | null,
  }>(
    () => {
      if (text == null) return {metadata: null, titleElement: null, descriptionElement: null}

      const contentPartMetadata = JSON.parse(text) as JSONObject;

      let titleText = (contentPartMetadata?.title as string | null) || null;
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

      let descriptionText = (contentPartMetadata?.description as string | null) || null;
      if (typeof descriptionText === 'string') descriptionText = descriptionText.trim();

      return {
        titleElement: titleText == null || titleText == '' ? null : <h1>{titleText}</h1>,
        descriptionElement: descriptionText == null || descriptionText == '' ? null : <p>{descriptionText}</p>,
      }
    },
    [text]
  )

  // TODO: We need to implement functionality for the capture part to actually fail, and for the user to request for the capture part to be retried (reset status to pending)
  const failedCapturePart = (
    <div className="blog-article-data-provider-capture-preview-thumbnail__warning">
      <Icon icon="warning-sign" />
      <Text>Failed to save article or post: {props.capturePart.url} ...</Text>
    </div>
  );

  // TODO: We need to implement functionality for the capture part to actually be cancelled, and for the user to request for the capture part to be retried (reset status to pending)
  const cancelledCapturePart = (
    <div className="blog-article-data-provider-capture-preview-thumbnail__warning">
      <Icon icon="warning-sign" />
      <Text>Attempt to save article or post was cancelled: {props.capturePart.url} ...</Text>
    </div>
  );

  const pendingCapturePart = (
    <div className="blog-article-data-provider-capture-preview-thumbnail__warning">
      <Icon icon="time" />
      <Text>Queued to be saved soon: {props.capturePart.url} ...</Text>
    </div>
  );

  const processingCapturePart = (
    <div className="blog-article-data-provider-capture-preview-thumbnail__warning">
      <Spinner size={SpinnerSize.SMALL}/>
      <Text>Saving article or post: {props.capturePart.url} ...</Text>
    </div>
  );

  const completedCapturePart = (
    <div className="blog-article-data-provider-capture-preview-thumbnail__container">

      <div className="blog-article-data-provider-capture-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div>

      <div className="blog-article-data-provider-capture-preview-thumbnail__operation-caption">
        {/* <Text ellipsize>Click to see this snapshot and its related pages</Text> */}
        {titleElement}
        {descriptionElement}
      </div>

      {/* <div className="blog-article-data-provider-capture-preview-thumbnail__status-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div> */}

      {/* {imageDataUrl != null && <img src={imageDataUrl} alt="Thumbnail of captured page" />} */}

      {/* <div className="blog-article-data-provider-capture-preview-thumbnail__image__overflow-gradient">&nbsp;</div> */}

    </div>
  );

  switch (props.capturePart.status) {
    case 'pending':
      return pendingCapturePart;
    case 'processing':
      return processingCapturePart;
    case 'completed':
      return completedCapturePart;
    case 'failed':
      return failedCapturePart;
    case 'cancelled':
      return cancelledCapturePart;
    default:
      return null;
  }
}

export default BlogArticleDataProviderCapturePartPreviewThumbnail;
