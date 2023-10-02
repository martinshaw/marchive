/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-10-01T03:39:45.780Z
Modified: 2023-10-01T03:39:45.781Z

Description: description
*/

import { DataProvidersRendererDetailsType } from "..";
import SimpleWebpageScreenshotDataProviderCapturePreviewThumbnail from "./SimpleWebpageScreenshotDataProviderCapturePreviewThumbnail";
import SimpleWebpageScreenshotDataProviderCaptureShowPageFragment from "./SimpleWebpageScreenshotDataProviderCaptureShowPageFragment";

const rendererDetails: DataProvidersRendererDetailsType = {
  components: {
    capturePreviewThumbnail: (props) => <SimpleWebpageScreenshotDataProviderCapturePreviewThumbnail {...props} />,
    captureShowPageFragment: (props) => <SimpleWebpageScreenshotDataProviderCaptureShowPageFragment {...props} />,
  },
}

export default rendererDetails;
