/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useCaptureSnapshot.ts
Created:  2023-09-27T02:07:17.719Z
Modified: 2023-09-27T02:07:17.719Z

Description: description
*/

import { useAsyncMemo } from 'use-async-memo';
import { Capture, CapturePart } from 'database';
import { CaptureAttributes } from 'database/src/models/Capture';
import { CapturePartAttributes } from 'database/src/models/CapturePart';

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
    [capture.id, capturePart?.id],
    null
  );

  return captureSnapshotUrl;
};

export default useCaptureSnapshot;
