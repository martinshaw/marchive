/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureReadability.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import getObjectFromJsonFile, {
  GetObjectFromJsonFileReturnType,
} from '../../layouts/DefaultLayout/functions/getObjectFromJsonFile';
import { CaptureEntityType, CapturePartEntityType } from 'common-types';

const useCaptureReadability: (
  capture: CaptureEntityType,
  capturePart: CapturePartEntityType | null,
) => GetObjectFromJsonFileReturnType = (capture, capturePart) => {
  const state = useAsyncMemo<GetObjectFromJsonFileReturnType>(
    () =>
      getObjectFromJsonFile({
        if: capture != null || capturePart != null,
        filePath: () =>
          capturePart != null
            ? 'marchive-downloads:///capture-part/' +
              capturePart.id +
              '/readability.json'
            : 'marchive-downloads:///capture/' +
              capture.id +
              '/readability.json',
      }),
    [capture.id, capturePart?.id],
    null,
  );

  return state;
};

export default useCaptureReadability;
