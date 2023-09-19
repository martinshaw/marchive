/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import ReactJson from 'react-json-view'
import { useAsyncMemo } from "use-async-memo";
import List from 'react-virtualized/dist/commonjs/List';
import { Location, Navigate, useLocation, useNavigate } from "react-router-dom";
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from "../..";
import { Button, ButtonGroup, ContextMenu, ContextMenuContentProps, H1, H4, Menu, MenuDivider, MenuItem, NonIdealState, Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import parseLocationWithSearchParams from "../../../layouts/DefaultLayout/functions/parseLocationWithSearchParams";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";
import BlogArticleDataProviderCapturePartPreviewThumbnail from "../BlogArticleDataProviderCapturePartPreviewThumbnail";
import getObjectFromJsonFile, { GetObjectFromJsonFileReturnType } from "../../../../renderer/layouts/DefaultLayout/functions/getObjectFromJsonFile";
import formatLocationUrlWithChangedSearchParams from "renderer/layouts/DefaultLayout/functions/formatLocationUrlWithChangedSearchParams";

import './index.scss'
import { useCallback } from 'react';
import { useMemo } from 'react';

const BlogArticleDataProviderCaptureShowPageFragment = (props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType = 'readability' | 'screenshot' | 'snapshot' | 'metadata';
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

  const captureReadabilityObject = useAsyncMemo<GetObjectFromJsonFileReturnType>(
    () =>
        getObjectFromJsonFile({
          if: props.capture != null && props?.capture?.schedule?.status === 'pending' && (mediaIsFocused && displayedMediaType === 'readability'),
          filePath: () => {
            const focusedCapturePart = getFocusedCapturePart();
            return focusedCapturePart != null ?
              'marchive-downloads:///capture-part/' + focusedCapturePart.id + '/readability.json' :
              'marchive-downloads:///capture/' + props.capture.id + '/readability.json';
          },
        }),
    [location.pathname, location.searchParams, props.capture, mediaIsFocused, displayedMediaType],
    null,
  );

  type CaptureImageStateReturnType = {
    captureImageUrl: string | 'error' | null;
    imageDimensions: {w: null | number, h: null | number};
  }
  const {
    captureImageUrl,
    imageDimensions,
  } = useAsyncMemo<CaptureImageStateReturnType>(
    () =>
      new Promise((resolve, reject) => {
        let returnValue: CaptureImageStateReturnType = {
          captureImageUrl: null,
          imageDimensions: {w: null, h: null},
        }

        let newImageUrl: string = 'marchive-downloads:///capture/' + props.capture.id + '/screenshot.jpg';

        const focusedCapturePart = getFocusedCapturePart();
        if (
          location.searchParams?.focused != null &&
          Array.isArray(location.searchParams?.focused) &&
          location.searchParams?.focused?.[0] === 'capture-part' &&
          typeof location.searchParams?.focused?.[1] === 'number' &&
          focusedCapturePart != null
        ) {
          newImageUrl = 'marchive-downloads:///capture-part/' + focusedCapturePart.id + '/screenshot.jpg';
        }

        console.log({newImageUrl, pathname: location.pathname, search: location.search, searchParams: location.searchParams, hash: location.hash});
        // returnValue.captureImageUrl = newImageUrl;
        // resolve(returnValue);

        const preloadImage = new Image();
        preloadImage.src = newImageUrl;
        preloadImage.onload = () => {
          console.log('Successfully loaded', newImageUrl, preloadImage.width, preloadImage.height)
          returnValue.captureImageUrl = newImageUrl;
          returnValue.imageDimensions.w = preloadImage.width;
          returnValue.imageDimensions.h = preloadImage.height;
          resolve(returnValue);
        }
        preloadImage.onerror = () => {
          resolve({
            captureImageUrl: 'error',
            imageDimensions: {w: null, h: null},
          })
        }
      }),
    [location.pathname, location.searchParams, props.capture, mediaIsFocused, displayedMediaType],
    {
      captureImageUrl: null,
      imageDimensions: {w: null, h: null},
    },
  );

  const captureSnapshotUrl = useAsyncMemo<string | null>(
    () =>
      new Promise((resolve, reject) => {
        if (mediaIsFocused === false || displayedMediaType !== 'snapshot') return resolve(null);

        else if (location.searchParams?.focused === 'capture')
          return resolve('marchive-downloads:///capture/' + props.capture.id + '/snapshot.mhtml');

        else {
          const focusedCapturePart = getFocusedCapturePart();
          if (location.searchParams?.focused != null && Array.isArray(location.searchParams?.focused) && location.searchParams?.focused?.[0] === 'capture-part' && typeof location.searchParams?.focused?.[1] === 'number' && focusedCapturePart != null) {
            return resolve('marchive-downloads:///capture-part/' + focusedCapturePart.id + '/snapshot.mhtml');
          }
        }
      }),
    [location.pathname, location.searchParams, props.capture, mediaIsFocused, displayedMediaType],
    null,
  );

  type CaptureMetadataStateReturnType = {
    captureMetadataObject: GetObjectFromJsonFileReturnType;
    titleText: string | null;
    descriptionText: string | null;
  }

  const {
    captureMetadataObject,
    titleText,
    descriptionText,
  } = useAsyncMemo<CaptureMetadataStateReturnType>(
    () =>
      getObjectFromJsonFile({
        if: props.capture != null && props?.capture?.schedule?.status === 'pending',
        filePath: () => {
          const focusedCapturePart = getFocusedCapturePart();
          return focusedCapturePart != null ?
            'marchive-downloads:///capture-part/' + focusedCapturePart.id + '/metadata.json' :
            'marchive-downloads:///capture/' + props.capture.id + '/metadata.json';
        },
      })
      .then((metadata) => {
        let returnValue: CaptureMetadataStateReturnType = {
          captureMetadataObject: null,
          titleText: null,
          descriptionText: null,
        };
        if (metadata == null) return returnValue;

        returnValue.captureMetadataObject = metadata;

        returnValue.titleText = (returnValue.captureMetadataObject?.title as string | null) || null;
        if (returnValue.titleText?.includes(' - ')) {
          const titleTextParts = returnValue.titleText.split(' - ');
          titleTextParts.pop()
          returnValue.titleText = titleTextParts.join(' - ');
        }
        if (returnValue.titleText?.includes(' | ')) {
          const titleTextParts = returnValue.titleText.split(' | ');
          titleTextParts.pop()
          returnValue.titleText = titleTextParts.join(' - ');
        }
        if (typeof returnValue.titleText === 'string') returnValue.titleText = returnValue.titleText.trim();

        returnValue.descriptionText = (returnValue.captureMetadataObject?.description as string | null) || null;
        if (typeof returnValue.descriptionText === 'string') returnValue.descriptionText = returnValue.descriptionText.trim();

        return returnValue;
      }),
    [location.pathname, location.searchParams, props.capture, mediaIsFocused, displayedMediaType],
    {
      captureMetadataObject: null,
      titleText: null,
      descriptionText: null,
    },
  );

  const usingDarkTheme = document.querySelector('#layout')?.classList?.contains('bp5-dark') || false;
  const metadataViewerTheme = usingDarkTheme ? 'bright' : 'bright:inverted';

  const className = 'blog-article-capture-show-fragment__container ' +
    (mediaIsFocused ? 'blog-article-capture-show-fragment__container--has-focused-media ' : '');

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

  const imageMediaContextMenu = (menuProps: ContextMenuContentProps) => {
    if (mediaIsFocused === false) return undefined;
    if (displayedMediaType !== 'screenshot') return undefined;

    const backButton = <MenuItem
      icon="arrow-left"
      text="Back"
      onClick={() => {
        navigate(formatLocationUrlWithChangedSearchParams({focused: false}, location))
      }}
    />;

    const openImageButton = <MenuItem
      icon="select"
      text="Open in Your Image Viewer"
      onClick={() => {
        window.electron.ipcRenderer.sendMessage(
          'utilities.open-internal-path-in-default-program',
          getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart() + '/screenshot.jpg',
        )
      }}
    />;

    const openDownloadLocationButton = <MenuItem
      icon="folder-open"
      text={"See Saved Files in " + fileBrowserName}
      onClick={() => {
        window.electron.ipcRenderer.sendMessage(
          'utilities.open-internal-path-in-default-program',
          getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart(),
        )
      }}
    />;

    return <Menu>
      {typeof captureImageUrl === 'string' && captureImageUrl !== 'error' && openImageButton}
      {typeof captureImageUrl === 'string' && captureImageUrl !== 'error' && openDownloadLocationButton}
      {typeof captureImageUrl === 'string' && captureImageUrl !== 'error' && props.capture.captureParts.length > 1 && <MenuDivider />}
      {props.capture.captureParts.length > 1 && backButton}
    </Menu>
  };

  if (props.capture.captureParts == null || (props.capture.captureParts || []).length < 1 && location?.searchParams?.focused !== 'capture') {
    return <Navigate to={'/captures/' + props.capture.id + '?focused=capture'} replace={true}/>
  }

  return (
    <div className={className}>
      <div
       className="blog-article-capture-show-fragment__left"
       onClick={() => {
         if (mediaIsFocused === true) return;
         navigate(formatLocationUrlWithChangedSearchParams(
           {focused: 'capture', displayedMediaType: 'readability'},
           location,
         ))
       }}
      >

        {mediaIsFocused &&
          <div className="blog-article-capture-show-fragment__left__toggle-buttons">
            <ButtonGroup>
              <Button
                text="Simplified"
                onClick={() => {
                  navigate(formatLocationUrlWithChangedSearchParams(
                    {displayedMediaType: 'readability'},
                    location,
                  ))
                }}
                active={displayedMediaType === 'readability'}
              />
              <Button
                text="Screenshot"
                onClick={() => {
                  navigate(formatLocationUrlWithChangedSearchParams(
                    {displayedMediaType: 'screenshot'},
                    location,
                  ))
                }}
                active={displayedMediaType === 'screenshot'}
              />
              <Button
                text="Snapshot"
                onClick={() => {
                  navigate(formatLocationUrlWithChangedSearchParams(
                    {displayedMediaType: 'snapshot'},
                    location,
                  ))
                }}
                active={displayedMediaType === 'snapshot'}
              />
              <Button
                text="Metadata"
                onClick={() => {
                  navigate(formatLocationUrlWithChangedSearchParams(
                    {displayedMediaType: 'metadata'},
                    location,
                  ))
                }}
                active={displayedMediaType === 'metadata'}
              />
            </ButtonGroup>

            <Button
              icon="folder-open"
              text={"See Saved Files in " + fileBrowserName}
              onClick={() => {
                window.electron.ipcRenderer.sendMessage(
                  'utilities.open-internal-path-in-default-program',
                  getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart(),
                )
              }}
            />

            <Button
              icon="cross"
              text={"See Other Articles"}
              onClick={() => {
                navigate('/captures/' + props.capture.id)
              }}
            />
          </div>
        }

        <div className="blog-article-capture-show-fragment__left__media">
          {captureImageUrl == null && <div className="blog-article-capture-show-fragment__left__media__placeholder"><Spinner size={SpinnerSize.STANDARD} /></div>}
          {(captureImageUrl != null && mediaIsFocused === false) &&
            <div
              className="blog-article-capture-show-fragment__left__media__image"
              style={{
                backgroundImage: 'url('+captureImageUrl+')',
                maxWidth: imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
              }}
              onClick={() => {
                navigate(formatLocationUrlWithChangedSearchParams(
                  {focused: 'capture', displayedMediaType: 'readability'},
                  location,
                ))
              }}
            />
          }

          {(captureReadabilityObject == null && mediaIsFocused && displayedMediaType === 'readability') &&
            <div className="blog-article-capture-show-fragment__left__media__readability-not-found">
              <NonIdealState
                icon='diagnosis'
                title='The Saved Simplified Article File Cannot Be Found'
                description={'It may have been moved or deleted. Click below to open the saved files in ' + fileBrowserName}
                action={
                  <Button
                    icon="folder-open"
                    text={"Open the Saved Files in " + fileBrowserName}
                    onClick={() => {
                      window.electron.ipcRenderer.sendMessage(
                        'utilities.open-internal-path-in-default-program',
                        getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart(),
                      );
                    }}
                  />
                }
              />
            </div>
          }

          {(captureReadabilityObject != null && mediaIsFocused && displayedMediaType === 'readability') &&
            <div
              className="blog-article-capture-show-fragment__left__media__readability"
              style={{
                width: '100%',
                maxWidth: imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
              }}
            >
              <H1
                className="blog-article-capture-show-fragment__left__media__readability-title font-serif"
                dangerouslySetInnerHTML={{__html: typeof captureReadabilityObject.title === 'string' ? captureReadabilityObject.title : ''}}
              ></H1>

              <H4
                className="blog-article-capture-show-fragment__left__media__readability-byline font-serif"
                dangerouslySetInnerHTML={{__html: typeof captureReadabilityObject.byline === 'string' ? captureReadabilityObject.byline : ''}}
              ></H4>


              <div
                className="blog-article-capture-show-fragment__left__media__readability-content font-serif"
                dangerouslySetInnerHTML={{__html: typeof captureReadabilityObject.content === 'string' ? captureReadabilityObject.content : ''}}
              ></div>
            </div>
          }

          {(captureImageUrl == 'error' && mediaIsFocused && displayedMediaType === 'screenshot') &&
            <div className="blog-article-capture-show-fragment__left__media__image-not-found">
              <NonIdealState
                icon='diagnosis'
                title='The Saved Screenshot File for This Article Cannot Be Found'
                description={'It may have been moved or deleted. Click below to open the saved files in ' + fileBrowserName}
                action={
                  <Button
                    icon="folder-open"
                    text={"Open the Saved Files in " + fileBrowserName}
                    onClick={() => {
                      window.electron.ipcRenderer.sendMessage(
                        'utilities.open-internal-path-in-default-program',
                        getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart(),
                      );
                    }}
                  />
                }
              />
            </div>
          }

          {(captureImageUrl != null && captureImageUrl !== 'error' && mediaIsFocused && displayedMediaType === 'screenshot') &&
            <ContextMenu content={imageMediaContextMenu}>
              <img
                className="blog-article-capture-show-fragment__left__media__image"
                style={{
                  maxWidth: imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
                }}
                src={captureImageUrl}
              />
            </ContextMenu>
          }

          {(captureSnapshotUrl != null && mediaIsFocused && displayedMediaType === 'snapshot') &&
            <div className="blog-article-capture-show-fragment__left__media__snapshot_placeholder">
              <NonIdealState
                icon='page-layout'
                title='In-App Snapshots Coming Soon'
                description='A simple and powerful interface for viewing snapshot files is coming soon. For now, you can open the snapshot in your browser...'
                action={
                  <Button
                    icon="globe"
                    text="Open the Saved Snapshot in Your Browser"
                    onClick={() => {
                      window.electron.ipcRenderer.sendMessage(
                        'utilities.open-internal-path-in-default-program',
                        getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart() + '/snapshot.mhtml',
                      );
                    }}
                  />
                }
              />
            </div>
          }

          {(captureMetadataObject == null && mediaIsFocused && displayedMediaType === 'metadata') &&
            <div className="blog-article-capture-show-fragment__left__media__metadata-not-found">
              <NonIdealState
                icon='diagnosis'
                title='The Saved Metadata File for This Article Cannot Be Found'
                description={'It may have been moved or deleted. Click below to open the saved files in ' + fileBrowserName}
                action={
                  <Button
                    icon="folder-open"
                    text={"Open the Saved Files in " + fileBrowserName}
                    onClick={() => {
                      window.electron.ipcRenderer.sendMessage(
                        'utilities.open-internal-path-in-default-program',
                        getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart(),
                      );
                    }}
                  />
                }
              />
            </div>
          }

          {(captureMetadataObject != null && mediaIsFocused && displayedMediaType === 'metadata') &&
            <ReactJson
             src={captureMetadataObject}
             theme={metadataViewerTheme}
             enableClipboard={true}
             displayObjectSize={false}
             displayDataTypes={false}
             quotesOnKeys={false}
            />
          }

          {mediaIsFocused !== true &&
            <div
              className="blog-article-capture-show-fragment__left__media__overflow-gradient"
              style={{
                maxWidth: imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
              }}
              onClick={() => {
                navigate(formatLocationUrlWithChangedSearchParams(
                  {focused: 'capture', displayedMediaType: 'readability'},
                  location,
                ))
              }}
            >&nbsp;</div>
          }
        </div>

        <div className="blog-article-capture-show-fragment__left__details">
          {titleText != null && <H1 className="blog-article-capture-show-fragment__left__details__title font-serif">
            {titleText as string | null}
          </H1>}

          {descriptionText != null && <Text className="blog-article-capture-show-fragment__left__details__description font-serif">
            {descriptionText as string | null}
          </Text>}

          <Text className="blog-article-capture-show-fragment__left__details__link">Click here to view the page's screenshot, snapshot and metadata...</Text>
        </div>
      </div>

      <div className="blog-article-capture-show-fragment__right">
        <H4 className="blog-article-capture-show-fragment__right__related-heading">
          Related Articles and Posts...
        </H4>

        <div className="blog-article-capture-show-fragment__right__list">
          <AutoSizer>
            {({height, width}) => (
              <List
                style={{paddingBottom: '50px'}}
                width={width}
                height={height}
                rowCount={(props?.capture?.captureParts ?? []).length}
                rowHeight={200}
                rowRenderer={({key, index, style}) => {
                  const capturePart = props?.capture?.captureParts?.[index];

                  return <div key={key} style={style} className="blog-article-capture-show-fragment__right__list__item">
                    <BlogArticleDataProviderCapturePartPreviewThumbnail
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

export default BlogArticleDataProviderCaptureShowPageFragment;
