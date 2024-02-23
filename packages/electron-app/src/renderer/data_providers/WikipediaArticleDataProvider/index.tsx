/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-12T01:00:58.365Z
Modified: 2023-09-12T01:00:58.365Z

Description: description
*/

import { DataProvidersRendererDetailsType } from '..';
import BlogArticleDataProviderCapturePreviewThumbnail from '../BlogArticleDataProvider/BlogArticleDataProviderCapturePreviewThumbnail';
import BlogArticleDataProviderCaptureShowPageFragment from '../BlogArticleDataProvider/BlogArticleDataProviderCaptureShowPageFragment';

const rendererDetails: DataProvidersRendererDetailsType = {
  components: {
    capturePreviewThumbnail: (props) => (
      <BlogArticleDataProviderCapturePreviewThumbnail {...props} />
    ),
    captureShowPageFragment: (props) => (
      <BlogArticleDataProviderCaptureShowPageFragment
        {...props}
        relatedHeadingCaption="Related Wikipedia Articles..."
      />
    ),
  },
};

export default rendererDetails;
