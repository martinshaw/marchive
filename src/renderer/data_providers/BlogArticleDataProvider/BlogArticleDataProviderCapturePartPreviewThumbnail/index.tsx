/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BlogArticleDataProviderCapturePartPreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { Text } from "@blueprintjs/core";
import { DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType } from "../..";
import useGetImageFromCaptureDirectory from "../../hooks/useGetImageFromCaptureDirectory";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";

import './index.scss'

const BlogArticleDataProviderCapturePartPreviewThumbnail = (props: DataProvidersRendererComponentCapturePartPreviewThumbnailPropsType) => {
  // const {
  //   imageDataUrl,
  //   fullPath,
  //   errorMessage,
  // } = useGetImageFromCaptureDirectory({
  //   capture: props.capture,
  //   path: 'index.jpg'
  // });

  const dateCaption = props?.capturePart?.createdAt == null ? null : useHumanDateCaption(props?.capturePart?.createdAt);

  return (
    <div className="blog-article-data-provider-capture-preview-thumbnail__container">

      <div className="blog-article-data-provider-capture-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div>

      <div className="blog-article-data-provider-capture-preview-thumbnail__operation-caption">
        {/* <Text ellipsize>Click to see this snapshot and its related pages</Text> */}
        {JSON.stringify(props.capturePart)}
      </div>

      {/* <div className="blog-article-data-provider-capture-preview-thumbnail__status-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div> */}

      {/* {imageDataUrl != null && <img src={imageDataUrl} alt="Thumbnail of captured page" />} */}

      <div className="blog-article-data-provider-capture-preview-thumbnail__image__overflow-gradient">&nbsp;</div>

    </div>
  )
}

export default BlogArticleDataProviderCapturePartPreviewThumbnail;
