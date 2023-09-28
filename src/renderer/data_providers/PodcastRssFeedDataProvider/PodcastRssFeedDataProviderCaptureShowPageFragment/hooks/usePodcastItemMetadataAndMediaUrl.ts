/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: usePodcastItemMetadataAndMediaUrl.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import { Capture, CapturePart } from '../../../../../main/database';
import { CaptureAttributes } from '../../../../../main/database/models/Capture';
import { CapturePartAttributes } from '../../../../../main/database/models/CapturePart';
import getObjectFromJsonFile from '../../../../layouts/DefaultLayout/functions/getObjectFromJsonFile';
import Parser from 'rss-parser';

type PodcastRssFeedDataProviderPartPayloadType = {
  index: number;
} & {
  [key: string]: any;
} & Parser.Item

const audioFileExtensions = ['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac', '.wma', '.alac']
const videoFileExtensions = ['.mp4', '.m4v', '.mov', '.wmv', '.avi', '.avchd', '.flv', '.f4v', '.swf', '.mkv', '.webm', '.vob', '.ogv', '.drc', '.gif', '.gifv', '.mng', '.mts', '.m2ts', '.ts', '.mov', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', '.asf', '.amv', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mpg', '.mpeg', '.m2v', '.m4v', '.svi', '.3gp', '.3g2', '.mxf', '.roq', '.nsv', '.flv', '.f4v', '.f4p', '.f4a', '.f4b']

export type UsePodcastAudioVideoUrlReturnType = {
  capturePartMetadataObject: PodcastRssFeedDataProviderPartPayloadType | null,
  titleText: string | null,
  mediaUrl: string | null,
  mediaType: 'audio' | 'video' | null,
  dateText: string | null,
  contentText: string | null,
};

/**
 * Based on useCaptureMetadata hook with the removal of description and the addition of the media file url
 */
const usePodcastItemMetadataAndMediaUrl: (
  capture: Capture | CaptureAttributes,
  capturePart: CapturePart | CapturePartAttributes | null
) => UsePodcastAudioVideoUrlReturnType = (capture, capturePart) => {
  return useAsyncMemo<UsePodcastAudioVideoUrlReturnType>(
    () =>
      getObjectFromJsonFile({
        if: capture != null && capture?.schedule?.status === 'pending',
        filePath: () => {
          return capturePart != null
            ? 'marchive-downloads:///capture-part/' +
                capturePart.id +
                '/metadata.json'
            : 'marchive-downloads:///capture/' + capture.id + '/metadata.json';
        },
      }).then((metadata) => {
        let returnValue: UsePodcastAudioVideoUrlReturnType = {
          capturePartMetadataObject: null,
          titleText: null,
          mediaUrl: null,
          mediaType: null,
          dateText: null,
          contentText: null,
        };
        if (metadata == null) return returnValue;

        returnValue.capturePartMetadataObject =
          metadata as PodcastRssFeedDataProviderPartPayloadType;

        returnValue.titleText =
          (returnValue.capturePartMetadataObject?.title as string | null) ||
          null;
        if (returnValue.titleText?.includes(' - ')) {
          const titleTextParts = returnValue.titleText.split(' - ');
          titleTextParts.pop();
          returnValue.titleText = titleTextParts.join(' - ');
        }
        if (returnValue.titleText?.includes(' | ')) {
          const titleTextParts = returnValue.titleText.split(' | ');
          titleTextParts.pop();
          returnValue.titleText = titleTextParts.join(' - ');
        }
        if (typeof returnValue.titleText === 'string')
          returnValue.titleText = returnValue.titleText.trim();

        /**
         * Based on getUrlForFeedItem from PodcastRssFeedDataProvider/index.ts
         */
        if (
          returnValue.capturePartMetadataObject?.link != null &&
          returnValue.capturePartMetadataObject?.link !== '' &&
          typeof returnValue.capturePartMetadataObject?.link === 'string'
        )
          returnValue.mediaUrl =
            returnValue.capturePartMetadataObject?.link.trim();
        if (
          returnValue.capturePartMetadataObject?.enclosure?.url != null &&
          returnValue.capturePartMetadataObject?.enclosure?.url !== '' &&
          typeof returnValue.capturePartMetadataObject?.enclosure?.url ===
            'string'
        )
          returnValue.mediaUrl =
            returnValue.capturePartMetadataObject?.enclosure.url.trim();

        if (returnValue.mediaUrl != null && returnValue.mediaUrl !== '') {
          const mediaUrlParts = returnValue.mediaUrl.split('.');
          const mediaUrlFileExtension = mediaUrlParts.pop();
          if (mediaUrlFileExtension != null && mediaUrlFileExtension !== '') {
            if (audioFileExtensions.includes('.' + mediaUrlFileExtension)) returnValue.mediaType = 'audio';
            if (videoFileExtensions.includes('.' + mediaUrlFileExtension)) returnValue.mediaType = 'video';
          }
        }

        if (
          returnValue.capturePartMetadataObject?.isoDate != null &&
          typeof returnValue.capturePartMetadataObject?.isoDate === 'string' &&
          returnValue.capturePartMetadataObject?.isoDate !== ''
        ) {
          const publishedDate = new Date(returnValue.capturePartMetadataObject?.isoDate);
          returnValue.dateText =
            publishedDate.toLocaleDateString() +
            ' ' +
            publishedDate.toLocaleTimeString();
        }

        if (
          returnValue.capturePartMetadataObject?.contentSnippet != null &&
          typeof returnValue.capturePartMetadataObject?.contentSnippet === 'string' &&
          returnValue.capturePartMetadataObject?.contentSnippet !== ''
        ) {
          returnValue.contentText =
            returnValue.capturePartMetadataObject?.contentSnippet;
        }

        if (
          returnValue.capturePartMetadataObject?.content != null &&
          typeof returnValue.capturePartMetadataObject?.content === 'string' &&
          returnValue.capturePartMetadataObject?.content !== ''
        ) {
          returnValue.contentText =
            returnValue.capturePartMetadataObject?.content;
        }

        return returnValue;
      }),
    [capture, capturePart],
    {
      capturePartMetadataObject: null,
      titleText: null,
      mediaUrl: null,
      mediaType: null,
      dateText: null,
      contentText: null,
    }
  );
};

export default usePodcastItemMetadataAndMediaUrl;
