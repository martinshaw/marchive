/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureSnapshot.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import { ParseLocationWithSearchParamsReturnType } from '../../layouts/DefaultLayout/functions/parseLocationWithSearchParams';
import { Capture, CapturePart } from '../../../main/database';
import { CaptureAttributes } from '../../../main/database/models/Capture';
import { CapturePartAttributes } from '../../../main/database/models/CapturePart';

const useCaptureSnapshot: (
  capture: Capture | CaptureAttributes,
  capturePart: CapturePart | CapturePartAttributes | null
) => string | null = (capture, capturePart) => {
  const captureSnapshotUrl = useAsyncMemo<string | null>(
    () =>
      new Promise((resolve, reject) => {
        if (capture != null && capturePart == null) {
          return resolve(
            'marchive-downloads:///capture/' + capture.id + '/snapshot.mhtml'
          );
        } else if (capture != null && capturePart != null) {
          return resolve(
            'marchive-downloads:///capture-part/' +
              capturePart.id +
              '/snapshot.mhtml'
          );
        } else {
          return resolve(null);
        }
      }),
    [capture, capturePart],
    null
  );

  return captureSnapshotUrl;
};

export default useCaptureSnapshot;