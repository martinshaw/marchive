/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: PodcastRssFeedDataProviderCapturePreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { Spinner, SpinnerSize, Text } from '@blueprintjs/core';
import { DataProvidersRendererComponentCapturePreviewThumbnailPropsType } from '../..';
import useHumanDateCaption from '../../../../renderer/data_providers/hooks/useHumanDateCaption';

import './index.scss';

const PodcastRssFeedDataProviderCapturePreviewThumbnail = (
  props: DataProvidersRendererComponentCapturePreviewThumbnailPropsType
) => {
  const dateCaption =
    props?.capture?.createdAt == null
      ? null
      : useHumanDateCaption(props.capture.createdAt, true);

  return (
    <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__container">
      <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div>

      <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__operation-caption">
        <Text ellipsize>
          Click to see the saved podcast episodes
        </Text>
      </div>
    </div>
  );
};

export default PodcastRssFeedDataProviderCapturePreviewThumbnail;
