/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import { useMemo } from 'react';
import { useCallback } from 'react';
import ReactJson from 'react-json-view';
import { Grid } from 'react-virtualized';
import { useAsyncMemo } from "use-async-memo";
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import useHumanDateCaption from "../../hooks/useHumanDateCaption";
import { Location, Navigate, useLocation, useNavigate } from "react-router-dom";
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from "../..";
import { RssParserFeedType } from '../../../../main/app/data_providers/PodcastRssFeedDataProvider';
import parseLocationWithSearchParams from "../../../layouts/DefaultLayout/functions/parseLocationWithSearchParams";
import PodcastRssFeedDataProviderCapturePartPreviewThumbnail from '../PodcastRssFeedDataProviderCapturePartPreviewThumbnail';
import getObjectFromJsonFile, { GetObjectFromJsonFileReturnType } from "../../../layouts/DefaultLayout/functions/getObjectFromJsonFile";
import formatLocationUrlWithChangedSearchParams from "../../../../renderer/layouts/DefaultLayout/functions/formatLocationUrlWithChangedSearchParams";
import { Button, ButtonGroup, ContextMenu, ContextMenuContentProps, H1, H4, Menu, MenuDivider, MenuItem, NonIdealState, Spinner, SpinnerSize, Text } from "@blueprintjs/core";

import './index.scss'

const PodcastRssFeedDataProviderCaptureShowPageFragment = (props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType = 'media' | 'details' | 'metadata';
  type CaptureFocusedMediaStateReturnType = { mediaIsFocused: boolean, displayedMediaType: CaptureStateDisplayedMediaType };
  const {
    mediaIsFocused,
    displayedMediaType,
  } = useMemo<CaptureFocusedMediaStateReturnType>(
    () => {
      return {
        mediaIsFocused: location.searchParams?.focused != null,
        displayedMediaType: location.searchParams?.displayedMediaType as CaptureStateDisplayedMediaType ?? 'readability',
      };
    },
    [location.pathname, location.searchParams, props.capture],
  );

  const getFocusedCapturePart = useCallback(
    () => {
      if (props?.capture?.captureParts == null || (props?.capture?.captureParts || []).length < 1) return null;
      const focusedSearchParam = location.searchParams.focused;
      if (Array.isArray(focusedSearchParam) === false) return null;
      const focusedSearchParamAsArray = focusedSearchParam as [string, number];
      if (focusedSearchParamAsArray[0] !== 'capture-part' || typeof focusedSearchParamAsArray[1] !== 'number') return null;
      const capturePart = props.capture.captureParts.find((capturePart) => capturePart.id === focusedSearchParamAsArray[1]);
      if (capturePart == null) return null;
      return capturePart;
    },
    [location.pathname, location.searchParams, props.capture, displayedMediaType],
  );

  // type CaptureImageStateReturnType = {
  //   captureImageUrl: string | 'error' | null;
  //   imageDimensions: {w: null | number, h: null | number};
  // }
  // const {
  //   captureImageUrl,
  //   imageDimensions,
  // } = useAsyncMemo<CaptureImageStateReturnType>(
  //   () =>
  //     new Promise((resolve, reject) => {
  //       let returnValue: CaptureImageStateReturnType = {
  //         captureImageUrl: null,
  //         imageDimensions: {w: null, h: null},
  //       }

  //       let newImageUrl: string = 'marchive-downloads:///capture/' + props.capture.id + '/screenshot.jpg';

  //       const focusedCapturePart = getFocusedCapturePart();
  //       if (
  //         location.searchParams?.focused != null &&
  //         Array.isArray(location.searchParams?.focused) &&
  //         location.searchParams?.focused?.[0] === 'capture-part' &&
  //         typeof location.searchParams?.focused?.[1] === 'number' &&
  //         focusedCapturePart != null
  //       ) {
  //         newImageUrl = 'marchive-downloads:///capture-part/' + focusedCapturePart.id + '/screenshot.jpg';
  //       }

  //       console.log({newImageUrl, pathname: location.pathname, search: location.search, searchParams: location.searchParams, hash: location.hash});
  //       // returnValue.captureImageUrl = newImageUrl;
  //       // resolve(returnValue);

  //       const preloadImage = new Image();
  //       preloadImage.src = newImageUrl;
  //       preloadImage.onload = () => {
  //         console.log('Successfully loaded', newImageUrl, preloadImage.width, preloadImage.height)
  //         returnValue.captureImageUrl = newImageUrl;
  //         returnValue.imageDimensions.w = preloadImage.width;
  //         returnValue.imageDimensions.h = preloadImage.height;
  //         resolve(returnValue);
  //       }
  //       preloadImage.onerror = () => {
  //         resolve({
  //           captureImageUrl: 'error',
  //           imageDimensions: {w: null, h: null},
  //         })
  //       }
  //     }),
  //   [location.pathname, location.searchParams, props.capture, mediaIsFocused, displayedMediaType],
  //   {
  //     captureImageUrl: null,
  //     imageDimensions: {w: null, h: null},
  //   },
  // );

  type CaptureFeedMetadataStateReturnType = {
    feedMetadataObject: RssParserFeedType | null;
    feedTitleText: string | null;
    feedDescriptionText: string | null;
  }

  const {
    feedMetadataObject,
    feedTitleText,
    feedDescriptionText,
  } = useAsyncMemo<CaptureFeedMetadataStateReturnType>(
    () =>
      getObjectFromJsonFile({
        if: props.capture != null && props?.capture?.schedule?.status === 'pending',
        filePath: 'marchive-downloads:///capture/' + props.capture.id + '/metadata.json',
      })
      .then((metadata) => {
        let returnValue: CaptureFeedMetadataStateReturnType = {
          feedMetadataObject: null,
          feedTitleText: null,
          feedDescriptionText: null,
        };
        if (metadata == null) return returnValue;

        returnValue.feedMetadataObject = metadata as RssParserFeedType;

        returnValue.feedTitleText = (returnValue.feedMetadataObject?.title as string | null) || null;
        if (returnValue.feedTitleText?.includes(' - ')) {
          const feedTitleTextParts = returnValue.feedTitleText.split(' - ');
          feedTitleTextParts.pop()
          returnValue.feedTitleText = feedTitleTextParts.join(' - ');
        }
        if (returnValue.feedTitleText?.includes(' | ')) {
          const feedTitleTextParts = returnValue.feedTitleText.split(' | ');
          feedTitleTextParts.pop()
          returnValue.feedTitleText = feedTitleTextParts.join(' - ');
        }
        if (typeof returnValue.feedTitleText === 'string') returnValue.feedTitleText = returnValue.feedTitleText.trim();

        returnValue.feedDescriptionText = (returnValue.feedMetadataObject?.description as string | null) || null;
        if (typeof returnValue.feedDescriptionText === 'string') returnValue.feedDescriptionText = returnValue.feedDescriptionText.trim();

        return returnValue;
      }),
    [location.pathname, location.searchParams, props.capture, mediaIsFocused, displayedMediaType],
    {
      feedMetadataObject: null,
      feedTitleText: null,
      feedDescriptionText: null,
    },
  );

  const usingDarkTheme = document.querySelector('#layout')?.classList?.contains('bp5-dark') || false;
  const metadataViewerTheme = usingDarkTheme ? 'bright' : 'bright:inverted';

  const className = 'podcast-rss-feed-capture-show-fragment__container ' +
    (mediaIsFocused ? 'podcast-rss-feed-capture-show-fragment__container--has-focused-media ' : '');

  const getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart = () => {
    let absolutePath = props.capture.downloadLocation;

    const locationFocusedSearchParam = location.searchParams.focused;
    if (Array.isArray(locationFocusedSearchParam) && locationFocusedSearchParam[0] === 'capture-part' && typeof locationFocusedSearchParam[1] === 'number') {
      const capturePart = props.capture.captureParts.find((capturePart) => capturePart.id === locationFocusedSearchParam[1]);
      if (capturePart != null) absolutePath = capturePart.downloadLocation;
    }

    return absolutePath;
  }

  let fileBrowserName = 'Your File Browser';
  if (window.electron.platform === 'darwin') fileBrowserName = 'Finder';
  if (window.electron.platform === 'win32') fileBrowserName = 'File Explorer';

  if (props.capture.captureParts == null || (props.capture.captureParts || []).length < 1 && location?.searchParams?.focused !== 'capture') {
    return <Navigate to={'/captures/' + props.capture.id + '?focused=capture'} replace={true}/>
  }

  /**
   * TODO: Currently we only an instance of 'Capture' with 'CapturePart' associations and the 'Schedule' instance without any 'Capture' associations.
   *   When / if we wish to amalgamate all Captures' CaptureParts into a single Capture-Show-page-style UI, we will have to
   *   add a Schedule instance with CapturePart associations to the Capture Show page loader
   *   and then amalgamate all the CaptureParts here into a single array.
   * @see https://www.notion.so/codeatlas/Make-the-whole-Capture-Index-page-a-DP-customisable-fragment-a581bbb662c74d97852888471a19d950?pvs=4
   */
  // const amalgamatedCaptureParts = useMemo<CapturePart[]>(
  //   () => props.schedule.captures.reduce(
  //     (carry, captures) => [...carry, ...captures.captureParts],
  //     [] as CapturePart[]
  //   ),
  //   [props.schedule.captures],
  // );
  const amalgamatedCaptureParts = props.capture.captureParts;

  const columnCount = 3;

  return (
    <div className={className}>
      <div className="podcast-rss-feed-capture-show-fragment__feed-details">
        {/* <div className="podcast-rss-feed-capture-show-fragment__feed-details__title">
          <H1>{feedTitleText ?? 'Loading...'}</H1>
        </div> */}
        <div className="podcast-rss-feed-capture-show-fragment__feed-details__description font-serif">
          <Text>{feedDescriptionText ?? 'Loading...'}</Text>
        </div>
      </div>

      <div className="podcast-rss-feed-capture-show-fragment__content">
        <H4 className="podcast-rss-feed-capture-show-fragment__content__heading font-serif">
          Episodes
        </H4>

        <div className="podcast-rss-feed-capture-show-fragment__content__grid">
          <AutoSizer>
            {({height, width}) => (
              <Grid
                style={{paddingBottom: '50px'}}
                width={width}
                height={height}
                rowCount={(amalgamatedCaptureParts ?? []).length}
                rowHeight={200}
                columnCount={columnCount}
                columnWidth={(width / columnCount) - 10}
                cellRenderer={({key, style, columnIndex, rowIndex}) => {
                  const index = (rowIndex * columnCount) + columnIndex;
                  const capturePart = amalgamatedCaptureParts[index];
                  if (capturePart == null) return null;

                  return <div key={key} style={style} className="podcast-rss-feed-capture-show-fragment__content__list__item">
                    <PodcastRssFeedDataProviderCapturePartPreviewThumbnail
                      key={key}
                      source={props.source}
                      schedule={props.schedule}
                      capture={props.capture}
                      capturePart={capturePart}
                      dataProvider={props.dataProvider}
                    />
                  </div>
                }}
              />
            )}
          </AutoSizer>
        </div>
      </div>

    </div>
  )

}

export default PodcastRssFeedDataProviderCaptureShowPageFragment;
