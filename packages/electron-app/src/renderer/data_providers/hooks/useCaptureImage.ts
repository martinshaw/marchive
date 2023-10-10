/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureImage.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import { Capture, CapturePart } from '../../../main/database';
import { CaptureAttributes } from '../../../main/database/models/Capture';
import { CapturePartAttributes } from '../../../main/database/models/CapturePart';

export type CaptureImageStateReturnType = {
  captureImageUrl: string | 'error' | null;
  imageDimensions: { w: null | number; h: null | number };
};

const useCaptureImage: (
  capture: Capture | CaptureAttributes,
  capturePart: CapturePart | CapturePartAttributes | null
) => CaptureImageStateReturnType = (capture, capturePart) => {
  const state = useAsyncMemo<CaptureImageStateReturnType>(
    () =>
      new Promise((resolve, reject) => {
        let returnValue: CaptureImageStateReturnType = {
          captureImageUrl: null,
          imageDimensions: { w: null, h: null },
        };

        let newImageUrl: string =
          'marchive-downloads:///capture/' + capture.id + '/screenshot.jpg';

        if (capturePart != null) {
          newImageUrl =
            'marchive-downloads:///capture-part/' +
            capturePart.id +
            '/screenshot.jpg';
        }

        const preloadImage = new Image();
        preloadImage.src = newImageUrl;
        preloadImage.onload = () => {
          returnValue.captureImageUrl = newImageUrl;
          returnValue.imageDimensions.w = preloadImage.width;
          returnValue.imageDimensions.h = preloadImage.height;
          resolve(returnValue);
        };
        preloadImage.onerror = () => {
          resolve({
            captureImageUrl: 'error',
            imageDimensions: { w: null, h: null },
          });
        };
      }),
    [capture.id, capturePart?.id],
    {
      captureImageUrl: null,
      imageDimensions: { w: null, h: null },
    }
  );

  return state;
};

export default useCaptureImage;
