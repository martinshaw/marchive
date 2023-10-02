/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { JSONTree } from 'react-json-tree';
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
import formatLocationUrlWithChangedSearchParams from '../../../layouts/DefaultLayout/functions/formatLocationUrlWithChangedSearchParams';
import brightBase16 from '../../../utilities/base16_themes/bright.base16';
import useCaptureImage from '../../hooks/useCaptureImage';
import useCaptureMetadata from '../../hooks/useCaptureMetadata';
import FocusedCaptureImageContextMenu from '../../components/FocusedCaptureImageContextMenu';

import './index.scss';

const SimpleWebpageDataProviderCaptureShowPageFragment = (
  props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType
) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());
  console.log('location', location);

  type CaptureStateDisplayedMediaType = 'screenshot' | 'metadata';

  const displayedMediaType =
    (location.searchParams
      ?.displayedMediaType as CaptureStateDisplayedMediaType) ?? 'screenshot';

  console.log('displayedMediaType ', location.searchParams, displayedMediaType);

  const { captureImageUrl, imageDimensions } = useCaptureImage(
    props.capture,
    null
  );

  const { captureMetadataObject, titleText, descriptionText } =
    useCaptureMetadata(props.capture, null);

  const usingDarkTheme =
    document.querySelector('#layout')?.classList?.contains('bp5-dark') || false;

  let fileBrowserName = 'Your File Browser';
  if (window.electron.platform === 'darwin') fileBrowserName = 'Finder';
  if (window.electron.platform === 'win32') fileBrowserName = 'Explorer';

  return (
    <div className="simple-webpage-screenshot-show-fragment__container">
      <div className="simple-webpage-screenshot-show-fragment__inner">
        <div className="simple-webpage-screenshot-show-fragment__toggle-buttons">
          <ButtonGroup>
            <Button
              text="Screenshot"
              onClick={() => {
                navigate(
                  formatLocationUrlWithChangedSearchParams(
                    { displayedMediaType: 'screenshot' },
                    location
                  )
                );
              }}
              active={displayedMediaType === 'screenshot'}
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
                props.capture.downloadLocation
              );
            }}
          />
        </div>

        <div className="simple-webpage-screenshot-show-fragment__media">
          {captureImageUrl == null && (
            <div className="simple-webpage-screenshot-show-fragment__media__placeholder">
              <Spinner size={SpinnerSize.STANDARD} />
            </div>
          )}

          {captureImageUrl == 'error' &&
            displayedMediaType === 'screenshot' && (
              <div className="simple-webpage-screenshot-show-fragment__media__image-not-found">
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
                          props.capture.downloadLocation
                        );
                      }}
                    />
                  }
                />
              </div>
            )}

          {captureImageUrl != null &&
            captureImageUrl !== 'error' &&
            displayedMediaType === 'screenshot' && (
              <div className="simple-webpage-screenshot-show-fragment__media__image">
                <FocusedCaptureImageContextMenu
                  capture={props.capture}
                  downloadLocation={props.capture.downloadLocation ?? ''}
                  imagePath="screenshot.jpg"
                  fileBrowserName={fileBrowserName}
                  toggleButtonsClassName='.simple-webpage-screenshot-show-fragment__toggle-buttons'
                >
                  <img
                    className="simple-webpage-screenshot-show-fragment__media__image__inner"
                    style={{
                      maxWidth:
                        imageDimensions.w == null
                          ? '100%'
                          : imageDimensions.w + 'px',
                    }}
                    src={captureImageUrl}
                  />
                </FocusedCaptureImageContextMenu>

                <div className="simple-webpage-screenshot-show-fragment__media__to-top-button">
                  <Button
                    icon="arrow-up"
                    onClick={() => {
                      const toggleButtons = document.querySelectorAll(
                        '.simple-webpage-screenshot-show-fragment__toggle-buttons'
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

          {captureMetadataObject == null &&
            displayedMediaType === 'metadata' && (
              <div className="simple-webpage-screenshot-show-fragment__media__metadata-not-found">
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
                          props.capture.downloadLocation
                        );
                      }}
                    />
                  }
                />
              </div>
            )}

          {captureMetadataObject != null &&
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
        </div>
      </div>
    </div>
  );
};

export default SimpleWebpageDataProviderCaptureShowPageFragment;
