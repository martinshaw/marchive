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
import { Grid } from 'react-virtualized';
import { useAsyncMemo } from "use-async-memo";
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Location, Navigate, useLocation, useNavigate } from "react-router-dom";
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from "../..";
import { RssParserFeedType } from '../../../../main/app/data_providers/PodcastRssFeedDataProvider';
import parseLocationWithSearchParams from "../../../layouts/DefaultLayout/functions/parseLocationWithSearchParams";
import PodcastRssFeedDataProviderCapturePartPreviewThumbnail from '../PodcastRssFeedDataProviderCapturePartPreviewThumbnail';
import getObjectFromJsonFile, { GetObjectFromJsonFileReturnType } from "../../../layouts/DefaultLayout/functions/getObjectFromJsonFile";
import { Button, ButtonGroup, ContextMenu, ContextMenuContentProps, H1, H4, Menu, MenuDivider, MenuItem, NonIdealState, Spinner, SpinnerSize, Text } from "@blueprintjs/core";

import './index.scss'
import useFocusedCapturePartFromLocation from 'renderer/data_providers/hooks/useFocusedCapturePartFromLocation';
import useCaptureMetadata from 'renderer/data_providers/hooks/useCaptureMetadata';

const PodcastRssFeedDataProviderCaptureShowPageFragment = (props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType = 'media-details' | 'metadata';

  const mediaIsFocused = location.searchParams?.focused != null;
  const displayedMediaType =
    (location.searchParams
      ?.displayedMediaType as CaptureStateDisplayedMediaType) ?? 'media-details';

  const {
    focusedCapturePart,
    focusedCaptureOrCapturePartDownloadLocation,
  } = useFocusedCapturePartFromLocation(
    location,
    props.capture,
    props.capture.captureParts ?? []
  );

  const { captureMetadataObject: feedMetadataObject, titleText: feedTitleText, descriptionText: feedDescriptionText } =
    useCaptureMetadata(props.capture, null);

  const usingDarkTheme = document.querySelector('#layout')?.classList?.contains('bp5-dark') || false;

  const className = 'podcast-rss-feed-capture-show-fragment__container ' +
    (mediaIsFocused ? 'podcast-rss-feed-capture-show-fragment__container--has-focused-media ' : '');

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
