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

const BlogArticleDataProviderCaptureShowPageFragment = (props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType = 'simplified' | 'screenshot' | 'snapshot' | 'metadata';

  type CaptureStateValueReturnType = {
    captureImageUrl: string | null;
    captureSnapshotUrl: string | null;
    metadata: GetObjectFromJsonFileReturnType;
    titleText: string | null;
    descriptionText: string | null;
    mediaIsFocused: boolean;
    displayedMediaType: CaptureStateDisplayedMediaType;
    imageDimensions: {w: null | number, h: null | number};
  }

  const {
    captureImageUrl,
    captureSnapshotUrl,
    metadata,
    titleText,
    descriptionText,
    mediaIsFocused,
    displayedMediaType,
    imageDimensions,
  } = useAsyncMemo<CaptureStateValueReturnType>(
    () => {
      return new Promise(async (resolve, reject) => {
        let returnValue: CaptureStateValueReturnType = {
          captureImageUrl: null,
          captureSnapshotUrl: null,
          metadata: null,
          titleText: null,
          descriptionText: null,
          mediaIsFocused: false,
          displayedMediaType: 'simplified',
          imageDimensions: {w: null, h: null},
        };

        const afterMetadataFileLoadCallback = async (metadata: CaptureStateValueReturnType['metadata']) => {
          returnValue.metadata = metadata;
          if (returnValue.metadata == null) {
            resolve(returnValue);
            return returnValue;
          }

          returnValue.titleText = (returnValue.metadata?.title as string | null) || null;
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

          returnValue.descriptionText = (returnValue.metadata?.description as string | null) || null;
          if (typeof returnValue.descriptionText === 'string') returnValue.descriptionText = returnValue.descriptionText.trim();

          const preloadImage = new Image();
          preloadImage.src = returnValue.captureImageUrl as string;
          preloadImage.onload = () => {
            returnValue.imageDimensions.w = preloadImage.width;
            returnValue.imageDimensions.h = preloadImage.height;
            resolve(returnValue);
          };
        }

        returnValue.displayedMediaType = location.searchParams?.displayedMediaType as CaptureStateDisplayedMediaType ?? 'simplified';

        if (location.searchParams == null || Object.values(location?.searchParams || {}).length === 0) {
          returnValue.mediaIsFocused = false;

          returnValue.captureImageUrl = 'marchive-downloads:///capture/' + props.capture.id + '/index.jpg';
          returnValue.captureSnapshotUrl = 'marchive-downloads:///capture/' + props.capture.id + '/snapshot.mhtml';

          getObjectFromJsonFile({
            if: props.capture != null && props?.capture?.schedule?.status === 'pending',
            filePath: 'marchive-downloads:///capture/' + props.capture.id + '/metadata.json',
          })
            .then(afterMetadataFileLoadCallback)
        } else if (location.searchParams?.focused === 'capture') {
          returnValue.mediaIsFocused = true;

          returnValue.captureImageUrl = 'marchive-downloads:///capture/' + props.capture.id + '/index.jpg';
          returnValue.captureSnapshotUrl = 'marchive-downloads:///capture/' + props.capture.id + '/snapshot.mhtml';

          getObjectFromJsonFile({
            if: props.capture != null && props?.capture?.schedule?.status === 'pending',
            filePath: 'marchive-downloads:///capture/' + props.capture.id + '/metadata.json',
          })
            .then(afterMetadataFileLoadCallback)
        } else if (location.searchParams?.focused != null && Array.isArray(location.searchParams?.focused) && location.searchParams?.focused?.[0] === 'capture-part' && typeof location.searchParams?.focused?.[1] === 'number') {
          returnValue.mediaIsFocused = true;

          if (props?.capture?.captureParts == null || (props?.capture?.captureParts || []).length < 1) return returnValue;
          const focusedIdSearchParam = location.searchParams.focused[1];

          const capturePart = props.capture.captureParts.find((capturePart) => capturePart.id === focusedIdSearchParam);
          if (capturePart == null) return returnValue;

          returnValue.captureImageUrl = 'marchive-downloads:///capture-part/' + capturePart.id + '/index.jpg';
          returnValue.captureSnapshotUrl = 'marchive-downloads:///capture-part/' + capturePart.id + '/snapshot.mhtml';

          getObjectFromJsonFile({
            if: props.capture != null && props?.capture?.schedule?.status === 'pending',
            filePath: 'marchive-downloads:///capture-part/' + capturePart.id + '/metadata.json',
          })
            .then(afterMetadataFileLoadCallback)
        }
      })
    },
    [location.pathname, location.search, props.capture],
    {
      captureImageUrl: null,
      captureSnapshotUrl: null,
      metadata: null,
      titleText: null,
      descriptionText: null,
      mediaIsFocused: false,
      displayedMediaType: 'simplified',
      imageDimensions: {w: null, h: null},
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
          getAbsoluteDownloadLocationForFocusedCaptureOrCapturePart() + '/index.jpg',
        )
      }}
    />;

    let fileBrowserName = 'Your File Browser';
    if (window.electron.platform === 'darwin') fileBrowserName = 'Finder';
    if (window.electron.platform === 'win32') fileBrowserName = 'File Explorer';
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
      {typeof captureImageUrl === 'string' && openImageButton}
      {typeof captureImageUrl === 'string' && openDownloadLocationButton}
      {typeof captureImageUrl === 'string' && props.capture.captureParts.length > 1 && <MenuDivider />}
      {props.capture.captureParts.length > 1 && backButton}
    </Menu>
  };

  if (props.capture.captureParts == null || (props.capture.captureParts || []).length < 1 && location?.searchParams?.focused !== 'capture') {
    return <Navigate to={'/captures/' + props.capture.id + '?focused=capture'} replace={true}/>
  }

  return (
    <div className={className}>

      <div className="blog-article-capture-show-fragment__left">

        {mediaIsFocused &&
          <div className="blog-article-capture-show-fragment__left__toggle-buttons">
            <ButtonGroup>
              <Button
                text="Simplified"
                onClick={() => {
                  navigate(formatLocationUrlWithChangedSearchParams(
                    {displayedMediaType: 'simplified'},
                    location,
                  ))
                }}
                active={displayedMediaType === 'simplified'}
              />
              <Button
                text="Screenshot"
                onClick={() => navigate(formatLocationUrlWithChangedSearchParams(
                  {displayedMediaType: 'screenshot'},
                  location,
                ))}
                active={displayedMediaType === 'screenshot'}
              />
              <Button
                text="Snapshot"
                onClick={() => navigate(formatLocationUrlWithChangedSearchParams(
                  {displayedMediaType: 'snapshot'},
                  location,
                ))}
                active={displayedMediaType === 'snapshot'}
              />
              <Button
                text="Metadata"
                onClick={() => navigate(formatLocationUrlWithChangedSearchParams(
                  {displayedMediaType: 'metadata'},
                  location,
                ))}
                active={displayedMediaType === 'metadata'}
              />
            </ButtonGroup>
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
                  {focused: 'capture', displayedMediaType: 'simplified'},
                  location,
                ))
              }}
            />
          }

          {/* TODO: ADD ERROR HANDLING WHEN THERE IS NO IMAGE HERE */}

          {(captureImageUrl != null && mediaIsFocused && displayedMediaType === 'screenshot') &&
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

          {/* TODO: ADD ERROR HANDLING WHEN THERE IS NO SNAPSHOT HERE */}

          {(captureSnapshotUrl != null && mediaIsFocused && displayedMediaType === 'snapshot') &&
              // <webview
              //   // className="blog-article-capture-show-fragment__left__media__image"
              //   style={{
              //     width: '100%',
              //     minHeight: imageDimensions.h == null ? '100%' : imageDimensions.h + 'px',
              //     maxWidth: imageDimensions.w == null ? '100%' : imageDimensions.w + 'px',
              //   }}
              //   src={captureSnapshotUrl}
              // >
              // </webview>
              <div
                className="blog-article-capture-show-fragment__left__media__snapshot_placeholder"
              >
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

          {/* TODO: ADD ERROR HANDLING WHEN THERE IS NO METADATA HERE */}

          {(metadata != null && mediaIsFocused && displayedMediaType === 'metadata') &&
            <ReactJson
             src={metadata}
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
                if (mediaIsFocused) return;
                navigate(formatLocationUrlWithChangedSearchParams(
                  {focused: 'capture', displayedMediaType: 'simplified'},
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
