/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: PodcastRssFeedDataProviderCapturePreviewThumbnail.tsx
Created:  2023-09-12T01:01:50.638Z
Modified: 2023-09-12T01:01:50.638Z

Description: description
*/

import { Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import { DataProvidersRendererComponentCapturePreviewThumbnailPropsType } from "../..";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";

import './index.scss'

const PodcastRssFeedDataProviderCapturePreviewThumbnail = (props: DataProvidersRendererComponentCapturePreviewThumbnailPropsType) => {
  // const imageDataUrl = 'marchive-downloads:///capture/'+props.capture.id + '/screenshot.jpg';
  const dateCaption = props?.capture?.createdAt == null ? null : useHumanDateCaption(props.capture.createdAt);

  return (
    <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__container">

      <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__date-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div>

      <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__operation-caption">
        <Text ellipsize>Click to see {props.capture.captureParts.length} podcast episode{props.capture.captureParts.length > 1 ? 's' : ''}</Text>
        {/* <Text ellipsize>Captured a snapshot of the page and of </Text> */}
      </div>

      {/* <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__status-caption">
        <Text ellipsize>{dateCaption || <>&nbsp;</>}</Text>
      </div> */}

      {/* {imageDataUrl == null && <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__image__placeholder"><Spinner size={SpinnerSize.STANDARD} /></div>}
      {imageDataUrl != null && <img src={imageDataUrl} alt="Thumbnail of captured page" />}

      <div className="podcast-rss-feed-data-provider-capture-preview-thumbnail__image__overflow-gradient">&nbsp;</div> */}

    </div>
  )
}

export default PodcastRssFeedDataProviderCapturePreviewThumbnail;
