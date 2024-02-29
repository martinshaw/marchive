/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ImageFileDownloadDataProviderDataProviderCapturePreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { Spinner, SpinnerSize, Text } from '@blueprintjs/core';
import useHumanDateCaption from '../../hooks/useHumanDateCaption';
import { DataProvidersRendererComponentCapturePreviewThumbnailPropsType } from '../..';

import './index.scss';
import useCaptureFiles from '../../hooks/useCaptureFiles';
import useCaptureImage from '../../hooks/useCaptureImage';

const ImageFileDownloadDataProviderDataProviderCapturePreviewThumbnail = (
  props: DataProvidersRendererComponentCapturePreviewThumbnailPropsType,
) => {
  const files = useCaptureFiles(props.capture, null, 'image');

  const { captureImageUrl, imageDimensions } = useCaptureImage(
    props.capture,
    null,
    files[0]?.name ?? null,
  );

  const dateCaption =
    props?.capture?.createdAt == null
      ? null
      : useHumanDateCaption(props.capture.createdAt, true);

  return (
    <div className="image-file-download-data-provider-capture-preview-thumbnail__container">
      <div className="image-file-download-data-provider-capture-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div>

      <div className="image-file-download-data-provider-capture-preview-thumbnail__operation-caption">
        <Text ellipsize>Click to see this image</Text>
      </div>

      {captureImageUrl == null && (
        <div className="image-file-download-data-provider-capture-preview-thumbnail__image__placeholder">
          <Spinner size={SpinnerSize.STANDARD} />
        </div>
      )}
      {captureImageUrl != null && (
        <img src={captureImageUrl} alt="Thumbnail of captured image" />
      )}
    </div>
  );
};

export default ImageFileDownloadDataProviderDataProviderCapturePreviewThumbnail;
