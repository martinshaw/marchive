/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-12T01:00:58.365Z
Modified: 2023-09-12T01:00:58.365Z

Description: description
*/

import { DataProvidersRendererDetailsType } from "..";
import BlogArticleDataProviderCapturePreviewThumbnail from "./BlogArticleDataProviderCapturePreviewThumbnail";
import BlogArticleDataProviderCapturePartPreviewThumbnail from "./BlogArticleDataProviderCapturePartPreviewThumbnail";

const rendererDetails: DataProvidersRendererDetailsType = {
  components: {
    capturePreviewThumbnail: (props) => <BlogArticleDataProviderCapturePreviewThumbnail {...props} />,
    capturePartPreviewThumbnail: (props) => <BlogArticleDataProviderCapturePartPreviewThumbnail {...props} />,
  },
}

export default rendererDetails;
