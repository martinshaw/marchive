/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureMetadata.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import getObjectFromJsonFile, {
  GetObjectFromJsonFileReturnType,
} from '../../layouts/DefaultLayout/functions/getObjectFromJsonFile';
import { CaptureEntityType, CapturePartEntityType } from 'common-types';

export type CaptureMetadataStateReturnType = {
  captureMetadataObject: GetObjectFromJsonFileReturnType;
  titleText: string | null;
  descriptionText: string | null;
};

const useCaptureMetadata: (
  capture: CaptureEntityType,
  capturePart: CapturePartEntityType | null,
) => CaptureMetadataStateReturnType = (capture, capturePart) => {
  const state = useAsyncMemo<CaptureMetadataStateReturnType>(
    () =>
      getObjectFromJsonFile({
        if: capture != null,
        filePath: () => {
          return capturePart != null
            ? 'marchive-downloads:///capture-part/' +
                capturePart.id +
                '/metadata.json'
            : 'marchive-downloads:///capture/' + capture.id + '/metadata.json';
        },
      }).then((metadata) => {
        let returnValue: CaptureMetadataStateReturnType = {
          captureMetadataObject: null,
          titleText: null,
          descriptionText: null,
        };
        if (metadata == null) return returnValue;

        returnValue.captureMetadataObject = metadata;

        returnValue.titleText =
          (returnValue.captureMetadataObject?.title as string | null) || null;
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

        returnValue.descriptionText =
          (returnValue.captureMetadataObject?.description as string | null) ||
          null;
        if (typeof returnValue.descriptionText === 'string')
          returnValue.descriptionText = returnValue.descriptionText.trim();

        return returnValue;
      }),
    [capture.id, capturePart?.id],
    {
      captureMetadataObject: null,
      titleText: null,
      descriptionText: null,
    },
  );

  return state;
};

export default useCaptureMetadata;
