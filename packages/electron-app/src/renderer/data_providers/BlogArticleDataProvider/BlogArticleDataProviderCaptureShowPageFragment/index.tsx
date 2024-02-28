/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import { JSONTree } from 'react-json-tree';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from '../..';
import {
  Button,
  ButtonGroup,
  H1,
  H4,
  NonIdealState,
  Spinner,
  SpinnerSize,
  Text,
} from '@blueprintjs/core';
import parseLocationWithSearchParams from '../../../layouts/DefaultLayout/functions/parseLocationWithSearchParams';
import BlogArticleDataProviderCapturePartPreviewThumbnail from '../BlogArticleDataProviderCapturePartPreviewThumbnail';
import formatLocationUrlWithChangedSearchParams from '../../../../renderer/layouts/DefaultLayout/functions/formatLocationUrlWithChangedSearchParams';
import brightBase16 from '../../../../renderer/utilities/base16_themes/bright.base16';
import useFocusedCapturePartFromLocation from '../../hooks/useFocusedCapturePartFromLocation';
import useCaptureReadability from '../../hooks/useCaptureReadability';
import useCaptureImage from '../../hooks/useCaptureImage';
import useCaptureSnapshot from '../../hooks/useCaptureSnapshot';
import useCaptureMetadata from '../../hooks/useCaptureMetadata';
import FocusedCaptureImageContextMenu from '../../components/FocusedCaptureImageContextMenu';

import './index.scss';

type BlogArticleDataProviderCaptureShowPageFragmentPropsType = {
  relatedHeadingCaption: string;
} & DataProvidersRendererComponentCaptureShowPageFragmentPropsType;

const BlogArticleDataProviderCaptureShowPageFragment = (
  props: BlogArticleDataProviderCaptureShowPageFragmentPropsType,
) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType =
    | 'readability'
    | 'screenshot'
    | 'snapshot'
    | 'metadata';

  const { focusedCapturePart, focusedCaptureOrCapturePartDownloadLocation } =
    useFocusedCapturePartFromLocation(
      location,
      props.capture,
      props.capture.captureParts ?? [],
    );

  const captureReadabilityObject = useCaptureReadability(
    props.capture,
    focusedCapturePart,
  );

  const { captureImageUrl, imageDimensions } = useCaptureImage(
    props.capture,
    focusedCapturePart,
  );

  const captureSnapshotUrl = useCaptureSnapshot(
    props.capture,
    focusedCapturePart,
  );

  const mediaIsFocused = location.searchParams?.focused != null;
  const displayedMediaType =
    (location.searchParams
      ?.displayedMediaType as CaptureStateDisplayedMediaType) ??
    (captureReadabilityObject != null ? 'readability' : 'screenshot');

  const { captureMetadataObject, titleText, descriptionText } =
    useCaptureMetadata(props.capture, focusedCapturePart);

  const usingDarkTheme =
    document.querySelector('#layout')?.classList?.contains('bp5-dark') || false;

  const className =
    'blog-article-capture-show-fragment__container ' +
    (mediaIsFocused
      ? 'blog-article-capture-show-fragment__container--has-focused-media '
      : '');

  let fileBrowserName = 'Your File Browser';
  if (window.electron.platform === 'darwin') fileBrowserName = 'Finder';
  if (window.electron.platform === 'win32') fileBrowserName = 'Explorer';

  if (
    props.capture.captureParts == null ||
    ((props.capture.captureParts || []).length < 1 &&
      location?.searchParams?.focused !== 'capture')
  ) {
    return (
      <Navigate
        to={'/captures/' + props.capture.id + '?focused=capture'}
        replace={true}
      />
    );
  }

  return (
    <div className={className}>
      <div
        className="blog-article-capture-show-fragment__left"
        onClick={() => {
          if (mediaIsFocused === true) return;
          navigate(
            formatLocationUrlWithChangedSearchParams(
              {
                focused: 'capture',
                displayedMediaType:
                  captureReadabilityObject != null
                    ? 'readability'
                    : 'screenshot',
              },
              location,
            ),
          );
        }}
      >
        {mediaIsFocused && (
          <div className="blog-article-capture-show-fragment__left__toggle-buttons">
            <ButtonGroup>
              {captureReadabilityObject != null && (
                <Button
                  text="Simplified"
                  onClick={() => {
                    navigate(
                      formatLocationUrlWithChangedSearchParams(
                        { displayedMediaType: 'readability' },
                        location,
                      ),
                    );
                  }}
                  active={displayedMediaType === 'readability'}
                />
              )}
              <Button
                text="Screenshot"
                onClick={() => {
                  navigate(
                    formatLocationUrlWithChangedSearchParams(
                      { displayedMediaType: 'screenshot' },
                      location,
                    ),
                  );
                }}
                active={displayedMediaType === 'screenshot'}
              />
              <Button
                text="Snapshot"
                onClick={() => {
                  navigate(
                    formatLocationUrlWithChangedSearchParams(
                      { displayedMediaType: 'snapshot' },
                      location,
                    ),
                  );
                }}
                active={displayedMediaType === 'snapshot'}
              />
              <Button
                text="Metadata"
                onClick={() => {
                  navigate(
                    formatLocationUrlWithChangedSearchParams(
                      { displayedMediaType: 'metadata' },
                      location,
                    ),
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
                  focusedCaptureOrCapturePartDownloadLocation,
                );
              }}
            />

            {props.capture.captureParts.length > 0 && (
              <Button
                icon="cross"
                text={'See Other Articles'}
                onClick={() => {
                  navigate('/captures/' + props.capture.id);
                }}
              />
            )}
          </div>
        )}

        <div className="blog-article-capture-show-fragment__left__media">
          {captureImageUrl == null && (
            <div className="blog-article-capture-show-fragment__left__media__placeholder">
              <Spinner size={SpinnerSize.STANDARD} />
            </div>
          )}
          {captureImageUrl != null && mediaIsFocused === false && (
            <div
              className="blog-article-capture-show-fragment__left__media__image"
              style={{
                backgroundImage: 'url(' + captureImageUrl + ')',
                maxWidth:
                  imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
              }}
              onClick={() => {
                navigate(
                  formatLocationUrlWithChangedSearchParams(
                    {
                      focused: 'capture',
                      displayedMediaType:
                        captureReadabilityObject != null
                          ? 'readability'
                          : 'screenshot',
                    },
                    location,
                  ),
                );
              }}
            />
          )}

          {captureReadabilityObject != null &&
            mediaIsFocused &&
            displayedMediaType === 'readability' && (
              <div
                className="blog-article-capture-show-fragment__left__media__readability"
                style={{
                  width: '100%',
                  maxWidth:
                    imageDimensions.w == null
                      ? '100%'
                      : imageDimensions.w + 'px',
                }}
              >
                <H1
                  className="blog-article-capture-show-fragment__left__media__readability-title font-serif"
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof captureReadabilityObject.title === 'string'
                        ? captureReadabilityObject.title
                        : '',
                  }}
                ></H1>

                <H4
                  className="blog-article-capture-show-fragment__left__media__readability-byline font-serif"
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof captureReadabilityObject.byline === 'string'
                        ? captureReadabilityObject.byline
                        : '',
                  }}
                ></H4>

                <div
                  className="blog-article-capture-show-fragment__left__media__readability-content font-serif"
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof captureReadabilityObject.content === 'string'
                        ? captureReadabilityObject.content
                        : '',
                  }}
                ></div>

                <div className="blog-article-capture-show-fragment__left__media__to-top-button">
                  <Button
                    icon="arrow-up"
                    onClick={() => {
                      const toggleButtons = document.querySelectorAll(
                        '.blog-article-capture-show-fragment__left__toggle-buttons',
                      );
                      if (Array.from(toggleButtons).length < 1) return;

                      toggleButtons[0].scrollIntoView({
                        behavior: 'smooth',
                      });
                    }}
                    text="Go to Top"
                  />
                </div>
              </div>
            )}

          {captureImageUrl == 'error' &&
            mediaIsFocused &&
            displayedMediaType === 'screenshot' && (
              <div className="blog-article-capture-show-fragment__left__media__image-not-found">
                <NonIdealState
                  icon="diagnosis"
                  title="The Saved Screenshot File for This Article Cannot Be Found"
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
                          focusedCaptureOrCapturePartDownloadLocation,
                        );
                      }}
                    />
                  }
                />
              </div>
            )}

          {captureImageUrl != null &&
            captureImageUrl !== 'error' &&
            mediaIsFocused &&
            displayedMediaType === 'screenshot' && (
              <div className="blog-article-capture-show-fragment__left__media__image">
                <FocusedCaptureImageContextMenu
                  capture={props.capture}
                  downloadLocation={
                    focusedCaptureOrCapturePartDownloadLocation ?? ''
                  }
                  imagePath="screenshot.jpg"
                  fileBrowserName={fileBrowserName}
                  toggleButtonsClassName=".blog-article-capture-show-fragment__left__toggle-buttons"
                >
                  <img
                    className="blog-article-capture-show-fragment__left__media__image__inner"
                    style={{
                      maxWidth:
                        imageDimensions.w == null
                          ? '100%'
                          : imageDimensions.w + 'px',
                    }}
                    src={captureImageUrl}
                  />
                </FocusedCaptureImageContextMenu>

                <div className="blog-article-capture-show-fragment__left__media__to-top-button">
                  <Button
                    icon="arrow-up"
                    onClick={() => {
                      const toggleButtons = document.querySelectorAll(
                        '.blog-article-capture-show-fragment__left__toggle-buttons',
                      );
                      if (Array.from(toggleButtons).length < 1) return;

                      toggleButtons[0].scrollIntoView({
                        behavior: 'smooth',
                      });
                    }}
                    text="Go to Top"
                  />
                </div>
              </div>
            )}

          {captureSnapshotUrl != null &&
            mediaIsFocused &&
            displayedMediaType === 'snapshot' && (
              <div className="blog-article-capture-show-fragment__left__media__snapshot_placeholder">
                <NonIdealState
                  icon="page-layout"
                  title="In-App Snapshots Coming Soon"
                  description="A simple and powerful interface for viewing snapshot files is coming soon. For now, you can open the snapshot in your browser..."
                  action={
                    <Button
                      icon="globe"
                      text="Open the Saved Snapshot in Your Browser"
                      onClick={() => {
                        window.electron.ipcRenderer.sendMessage(
                          'utilities.open-internal-path-in-default-program',
                          focusedCaptureOrCapturePartDownloadLocation +
                            '/snapshot.mhtml',
                        );
                      }}
                    />
                  }
                />
              </div>
            )}

          {captureMetadataObject == null &&
            mediaIsFocused &&
            displayedMediaType === 'metadata' && (
              <div className="blog-article-capture-show-fragment__left__media__metadata-not-found">
                <NonIdealState
                  icon="diagnosis"
                  title="The Saved Metadata File for This Article Cannot Be Found"
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
                          focusedCaptureOrCapturePartDownloadLocation,
                        );
                      }}
                    />
                  }
                />
              </div>
            )}

          {captureMetadataObject != null &&
            mediaIsFocused &&
            displayedMediaType === 'metadata' && (
              <div className="react-json-view">
                <JSONTree
                  data={captureMetadataObject || {}}
                  theme={brightBase16}
                  invertTheme={!usingDarkTheme}
                  hideRoot={true}
                  shouldExpandNodeInitially={() => true}
                />
              </div>
            )}

          {mediaIsFocused !== true && (
            <div
              className="blog-article-capture-show-fragment__left__media__overflow-gradient"
              style={{
                maxWidth:
                  imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
              }}
              onClick={() => {
                navigate(
                  formatLocationUrlWithChangedSearchParams(
                    {
                      focused: 'capture',
                      displayedMediaType:
                        captureReadabilityObject != null
                          ? 'readability'
                          : 'screenshot',
                    },
                    location,
                  ),
                );
              }}
            >
              &nbsp;
            </div>
          )}
        </div>

        <div className="blog-article-capture-show-fragment__left__details">
          {titleText != null && (
            <H1 className="blog-article-capture-show-fragment__left__details__title font-serif">
              {titleText as string | null}
            </H1>
          )}

          {descriptionText != null && (
            <Text className="blog-article-capture-show-fragment__left__details__description font-serif">
              {descriptionText as string | null}
            </Text>
          )}

          <Text className="blog-article-capture-show-fragment__left__details__link">
            Click here to view the page's screenshot, snapshot and metadata...
          </Text>
        </div>
      </div>

      <div className="blog-article-capture-show-fragment__right">
        <H4 className="blog-article-capture-show-fragment__right__related-heading font-serif">
          {props.relatedHeadingCaption}
        </H4>

        <div className="blog-article-capture-show-fragment__right__list">
          <AutoSizer>
            {({ height, width }) => (
              <List
                style={{ paddingBottom: '50px' }}
                width={width}
                height={height}
                rowCount={(props?.capture?.captureParts ?? []).length}
                rowHeight={200}
                rowRenderer={({ key, index, style }) => {
                  const capturePart = props?.capture?.captureParts[index];
                  if (capturePart == null) return null;

                  return (
                    <div
                      key={key}
                      style={style}
                      className="blog-article-capture-show-fragment__right__list__item"
                    >
                      <BlogArticleDataProviderCapturePartPreviewThumbnail
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
    </div>
  );
};

export default BlogArticleDataProviderCaptureShowPageFragment;
