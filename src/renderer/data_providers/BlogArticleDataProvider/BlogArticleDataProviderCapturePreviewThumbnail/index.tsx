/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BlogArticleDataProviderCapturePreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { Text } from "@blueprintjs/core";
import { DataProvidersRendererComponentCapturePreviewThumbnailPropsType } from "../..";
import useGetImageFromCaptureDirectory from "../../hooks/useGetImageFromCaptureDirectory";

import './index.scss'
import useHumanDateCaption from "renderer/data_providers/hooks/useHumanDateCaption";

const BlogArticleDataProviderCapturePreviewThumbnail = (props: DataProvidersRendererComponentCapturePreviewThumbnailPropsType) => {
  const {
    imageDataUrl,
    fullPath,
    errorMessage,
  } = useGetImageFromCaptureDirectory({
    capture: props.capture,
    path: 'index.jpg'
  });

  const dateCaption = props?.capture?.createdAt == null ? null : useHumanDateCaption(props.capture.createdAt);

  return (
    <div className="blog-article-data-provider-capture-preview-thumbnail__container">

      <div className="blog-article-data-provider-capture-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div>

      <div className="blog-article-data-provider-capture-preview-thumbnail__operation-caption">
        <Text ellipsize>Click to see this snapshot and its related pages</Text>
        {/* <Text ellipsize>Captured a snapshot of the page and of </Text> */}
      </div>

      {/* <div className="blog-article-data-provider-capture-preview-thumbnail__status-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div> */}

      {imageDataUrl != null && <img src={imageDataUrl} alt="Thumbnail of captured page" />}

      <div className="blog-article-data-provider-capture-preview-thumbnail__image__overflow-gradient">&nbsp;</div>

    </div>
  )
}

export default BlogArticleDataProviderCapturePreviewThumbnail;
