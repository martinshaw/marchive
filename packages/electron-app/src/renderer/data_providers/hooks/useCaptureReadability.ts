/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureReadability.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import { Capture, CapturePart } from '../../../main/database';
import { CaptureAttributes } from '../../../main/database/models/Capture';
import { CapturePartAttributes } from '../../../main/database/models/CapturePart';
import getObjectFromJsonFile, {
  GetObjectFromJsonFileReturnType,
} from '../../layouts/DefaultLayout/functions/getObjectFromJsonFile';

const useCaptureReadability: (
  capture: Capture | CaptureAttributes,
  capturePart: CapturePart | CapturePartAttributes | null
) => GetObjectFromJsonFileReturnType = (capture, capturePart) => {
  const state = useAsyncMemo<GetObjectFromJsonFileReturnType>(
    () =>
      getObjectFromJsonFile({
        if: capture != null,
        filePath: () => {
          return capturePart != null
            ? 'marchive-downloads:///capture-part/' +
                capturePart.id +
                '/readability.json'
            : 'marchive-downloads:///capture/' +
                capture.id +
                '/readability.json';
        },
      }),
    [capture.id, capturePart?.id],
    null
  );

  return state;
};

export default useCaptureReadability;
