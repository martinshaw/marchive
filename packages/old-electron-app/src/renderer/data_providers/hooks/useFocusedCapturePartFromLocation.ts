/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useFocusedCapturePartFromLocation.ts
Created:  2023-09-27T03:32:02.973Z
Modified: 2023-09-27T03:32:02.974Z

Description: description
*/

import { useMemo } from 'react';
import { Capture, CapturePart } from 'database';
import { CaptureAttributes } from 'database/src/models/Capture';
import { CapturePartAttributes } from 'database/src/models/CapturePart';
import { ParseLocationWithSearchParamsReturnType } from '../../layouts/DefaultLayout/functions/parseLocationWithSearchParams';

type UseFocusedCapturePartFromLocationReturnType = {
  focusedCapture: Capture | CaptureAttributes | null;
  focusedCapturePart: CapturePart | CapturePartAttributes | null;
  focusedCaptureOrCapturePartDownloadLocation: string | null;
}

const useFocusedCapturePartFromLocation: (
  location: ParseLocationWithSearchParamsReturnType,
  capture: Capture | CaptureAttributes,
  captureParts: CapturePart[]
) => UseFocusedCapturePartFromLocationReturnType = (location, capture, captureParts) => {
  return useMemo(() => {
    const state: UseFocusedCapturePartFromLocationReturnType = {
      focusedCapture: capture,
      focusedCapturePart: null,
      focusedCaptureOrCapturePartDownloadLocation: capture.downloadLocation,
    };

    if (captureParts.length < 1) return state;

    const focusedSearchParam = location.searchParams.focused;
    if (Array.isArray(focusedSearchParam) === false) return state;

    const focusedSearchParamAsArray = focusedSearchParam as [string, number];
    if (
      focusedSearchParamAsArray[0] !== 'capture-part' ||
      typeof focusedSearchParamAsArray[1] !== 'number'
    )
      return state;

    const capturePart = captureParts.find(
      (capturePart) => capturePart.id === focusedSearchParamAsArray[1]
    );
    if (capturePart == null) return state;

    state.focusedCapturePart = capturePart;
    return state;
  }, [location.pathname, location.searchParams, capture, captureParts]);
};

export default useFocusedCapturePartFromLocation;
