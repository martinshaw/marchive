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
import { useAsyncMemo } from 'use-async-memo';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Location, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from '../..';
import { RssParserFeedType } from '../../../../main/app/data_providers/PodcastRssFeedDataProvider';
import parseLocationWithSearchParams from '../../../layouts/DefaultLayout/functions/parseLocationWithSearchParams';
import PodcastRssFeedDataProviderCapturePartPreviewThumbnail from '../PodcastRssFeedDataProviderCapturePartPreviewThumbnail';
import getObjectFromJsonFile, {
  GetObjectFromJsonFileReturnType,
} from '../../../layouts/DefaultLayout/functions/getObjectFromJsonFile';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuContentProps,
  H1,
  H4,
  Menu,
  MenuDivider,
  MenuItem,
  NonIdealState,
  Spinner,
  SpinnerSize,
  Text,
} from '@blueprintjs/core';
import useFocusedCapturePartFromLocation from '../../../../renderer/data_providers/hooks/useFocusedCapturePartFromLocation';
import useCaptureMetadata from '../../../../renderer/data_providers/hooks/useCaptureMetadata';
import formatLocationUrlWithChangedSearchParams from '../../../../renderer/layouts/DefaultLayout/functions/formatLocationUrlWithChangedSearchParams';

import './index.scss';
import { JSONTree } from 'react-json-tree';
import brightBase16 from 'renderer/utilities/base16_themes/bright.base16';
import usePodcastItemMetadataAndMediaUrl from './hooks/usePodcastItemMetadataAndMediaUrl';

const PodcastRssFeedDataProviderCaptureShowPageFragment = (
  props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType
) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType = 'media-details' | 'metadata';

  const mediaIsFocused = location.searchParams?.focused != null;
  const displayedMediaType =
    (location.searchParams
      ?.displayedMediaType as CaptureStateDisplayedMediaType) ??
    'media-details';

  const {
    focusedCapture,
    focusedCapturePart,
    focusedCaptureOrCapturePartDownloadLocation,
  } = useFocusedCapturePartFromLocation(
    location,
    props.capture,
    props.capture.captureParts ?? []
  );

  const {
    captureMetadataObject: feedMetadataObject,
    titleText: feedTitleText,
    descriptionText: feedDescriptionText,
  } = useCaptureMetadata(props.capture, null);

  const {
    capturePartMetadataObject: focusedItemMetadataObject,
    titleText: focusedItemTitleText,
    mediaUrl: focusedItemMediaUrl,
    mediaType: focusedItemMediaType,
    dateText: focusedItemDateText,
    contentText: focusedItemContentText,
  } = usePodcastItemMetadataAndMediaUrl(props.capture, focusedCapturePart);

  const usingDarkTheme =
    document.querySelector('#layout')?.classList?.contains('bp5-dark') || false;

  const className =
    'podcast-rss-feed-capture-show-fragment__container ' +
    (mediaIsFocused
      ? 'podcast-rss-feed-capture-show-fragment__container--has-focused-media '
      : '');

  let fileBrowserName = 'Your File Browser';
  if (window.electron.platform === 'darwin') fileBrowserName = 'Finder';
  if (window.electron.platform === 'win32') fileBrowserName = 'File Explorer';

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

  const columnCount = 2;

  const contentPart = (
    <div className="podcast-rss-feed-capture-show-fragment__content">
      <H4 className="podcast-rss-feed-capture-show-fragment__content__heading font-serif">
        Episodes
      </H4>

      <div className="podcast-rss-feed-capture-show-fragment__content__grid">
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              style={{ paddingBottom: '50px' }}
              width={width}
              height={height}
              rowCount={(amalgamatedCaptureParts ?? []).length}
              rowHeight={210}
              columnCount={columnCount}
              columnWidth={width / columnCount - 10}
              cellRenderer={({ key, style, columnIndex, rowIndex }) => {
                const index = rowIndex * columnCount + columnIndex;
                const capturePart = amalgamatedCaptureParts[index];
                if (capturePart == null) return null;

                return (
                  <div
                    key={key}
                    style={style}
                    className="podcast-rss-feed-capture-show-fragment__content__list__item"
                  >
                    <PodcastRssFeedDataProviderCapturePartPreviewThumbnail
                      key={key}
                      source={props.source}
                      schedule={props.schedule}
                      capture={props.capture}
                      capturePart={capturePart}
                      dataProvider={props.dataProvider}
                    />
                  </div>
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );

  const focusedMediaPart = (
    <div className="podcast-rss-feed-capture-show-fragment__focused">
      <div className="podcast-rss-feed-capture-show-fragment__focused__toggle-buttons">
        <ButtonGroup>
          <Button
            text="Media & Details"
            onClick={() => {
              navigate(
                formatLocationUrlWithChangedSearchParams(
                  { displayedMediaType: 'media-details' },
                  location
                )
              );
            }}
            active={displayedMediaType === 'media-details'}
          />
          <Button
            text="Metadata"
            onClick={() => {
              navigate(
                formatLocationUrlWithChangedSearchParams(
                  { displayedMediaType: 'metadata' },
                  location
                )
              );
            }}
            active={displayedMediaType === 'metadata'}
          />
        </ButtonGroup>

        <Button
          icon="folder-open"
          text={'See Saved Files in ' + fileBrowserName}
          onClick={() => {
            window.electron.ipcRenderer.sendMessage(
              'utilities.open-internal-path-in-default-program',
              focusedCaptureOrCapturePartDownloadLocation
            );
          }}
        />

        {props.capture.captureParts.length > 0 && (
          <Button
            icon="cross"
            text={'See Other Episodes'}
            onClick={() => {
              navigate('/captures/' + props.capture.id);
            }}
          />
        )}
      </div>

      {focusedItemMediaUrl == null &&
        mediaIsFocused &&
        displayedMediaType === 'media-details' && (
          <div className="podcast-rss-feed-capture-show-fragment__focused__details-not-found">
            <NonIdealState
              icon="diagnosis"
              title="The Saved Information About This Episode Cannot Be Found"
              description={
                'It may have been moved or deleted. Click below to open the saved files in ' +
                fileBrowserName
              }
              action={
                <Button
                  icon="folder-open"
                  text={'Open the Saved Files in ' + fileBrowserName}
                  onClick={() => {
                    window.electron.ipcRenderer.sendMessage(
                      'utilities.open-internal-path-in-default-program',
                      focusedCaptureOrCapturePartDownloadLocation
                    );
                  }}
                />
              }
            />
          </div>
        )}

      {focusedItemMediaUrl != null &&
        mediaIsFocused &&
        displayedMediaType === 'media-details' && (
          <div className="podcast-rss-feed-capture-show-fragment__focused__details">
            <div className="podcast-rss-feed-capture-show-fragment__focused__details__media">
              {focusedItemMediaType === 'video' && (
                <video
                  src={focusedItemMediaUrl}
                  controls={true}
                  autoPlay={false}
                  controlsList="nodownload"
                />
              )}

              {focusedItemMediaType === 'audio' && (
                <audio
                  src={focusedItemMediaUrl}
                  controls={true}
                  autoPlay={false}
                  controlsList="nodownload"
                />
              )}
            </div>

            <H1 className="podcast-rss-feed-capture-show-fragment__focused__details__title font-serif">
              {focusedItemTitleText}
            </H1>
            <div className="podcast-rss-feed-capture-show-fragment__focused__details__date font-serif">
              {focusedItemDateText}
            </div>
            <div
              className="podcast-rss-feed-capture-show-fragment__focused__details__content font-serif"
              dangerouslySetInnerHTML={{
                __html:
                  typeof focusedItemContentText === 'string'
                    ? focusedItemContentText
                    : '',
              }}
            ></div>
          </div>
        )}

      {focusedItemMetadataObject == null &&
        mediaIsFocused &&
        displayedMediaType === 'metadata' && (
          <div className="podcast-rss-feed-capture-show-fragment__focused__metadata-not-found">
            <NonIdealState
              icon="diagnosis"
              title="The Saved Metadata File for This Episode Cannot Be Found"
              description={
                'It may have been moved or deleted. Click below to open the saved files in ' +
                fileBrowserName
              }
              action={
                <Button
                  icon="folder-open"
                  text={'Open the Saved Files in ' + fileBrowserName}
                  onClick={() => {
                    window.electron.ipcRenderer.sendMessage(
                      'utilities.open-internal-path-in-default-program',
                      focusedCaptureOrCapturePartDownloadLocation
                    );
                  }}
                />
              }
            />
          </div>
        )}

      {focusedItemMetadataObject != null &&
        mediaIsFocused &&
        displayedMediaType === 'metadata' && (
          <div className="podcast-rss-feed-capture-show-fragment__focused__metadata">
            <JSONTree
              data={focusedItemMetadataObject || {}}
              theme={brightBase16}
              invertTheme={!usingDarkTheme}
              hideRoot={true}
              shouldExpandNodeInitially={() => true}
            />
          </div>
        )}
    </div>
  );

  return (
    <div className={className}>
      <div className="podcast-rss-feed-capture-show-fragment__feed-details">
        <div className="podcast-rss-feed-capture-show-fragment__feed-details__description font-serif">
          <Text>{feedDescriptionText ?? 'Loading...'}</Text>
        </div>
      </div>

      {mediaIsFocused ? focusedMediaPart : contentPart}
    </div>
  );
};

export default PodcastRssFeedDataProviderCaptureShowPageFragment;
