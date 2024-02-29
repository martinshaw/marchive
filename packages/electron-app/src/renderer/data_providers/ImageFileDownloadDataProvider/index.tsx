/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-10-01T03:39:45.780Z
Modified: 2023-10-01T03:39:45.781Z

Description: description
*/

import { DataProvidersRendererDetailsType } from '..';
import ImageFileDownloadDataProviderDataProviderCapturePreviewThumbnail from './ImageFileDownloadDataProviderCapturePreviewThumbnail';
import ImageFileDownloadDataProviderDataProviderCaptureShowPageFragment from './ImageFileDownloadDataProviderCaptureShowPageFragment';

const rendererDetails: DataProvidersRendererDetailsType = {
  components: {
    capturePreviewThumbnail: (props) => (
      <ImageFileDownloadDataProviderDataProviderCapturePreviewThumbnail
        {...props}
      />
    ),
    captureShowPageFragment: (props) => (
      <ImageFileDownloadDataProviderDataProviderCaptureShowPageFragment
        {...props}
      />
    ),
  },
};

export default rendererDetails;
