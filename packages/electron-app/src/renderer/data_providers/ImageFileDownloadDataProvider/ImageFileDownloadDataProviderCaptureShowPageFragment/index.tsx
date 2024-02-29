/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import {
  Button,
  ButtonGroup,
  NonIdealState,
  Spinner,
  SpinnerSize,
} from '@blueprintjs/core';
import useCaptureImage from '../../hooks/useCaptureImage';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from '../..';
import FocusedCaptureImageContextMenu from '../../components/FocusedCaptureImageContextMenu';
import parseLocationWithSearchParams from '../../../layouts/DefaultLayout/functions/parseLocationWithSearchParams';
import formatLocationUrlWithChangedSearchParams from '../../../layouts/DefaultLayout/functions/formatLocationUrlWithChangedSearchParams';
import useCaptureFiles from '../../hooks/useCaptureFiles';

import './index.scss';

const ImageFileDownloadDataProviderCaptureShowPageFragment = (
  props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType,
) => {
  const navigate = useNavigate();
  const location = parseLocationWithSearchParams(useLocation());

  type CaptureStateDisplayedMediaType = 'image';

  const displayedMediaType =
    (location.searchParams
      ?.displayedMediaType as CaptureStateDisplayedMediaType) ?? 'image';

  const files = useCaptureFiles(props.capture, null, 'image');

  const { captureImageUrl, imageDimensions } = useCaptureImage(
    props.capture,
    null,
    files[0]?.name ?? null,
  );

  let fileBrowserName = 'Your File Browser';
  if (window.electron.platform === 'darwin') fileBrowserName = 'Finder';
  if (window.electron.platform === 'win32') fileBrowserName = 'Explorer';

  return (
    <div className="image-file-download-show-fragment__container">
      <div className="image-file-download-show-fragment__inner">
        <div className="image-file-download-show-fragment__toggle-buttons">
          <ButtonGroup>
            <Button
              text="Image"
              onClick={() => {
                navigate(
                  formatLocationUrlWithChangedSearchParams(
                    { displayedMediaType: 'image' },
                    location,
                  ),
                );
              }}
              active={displayedMediaType === 'image'}
            />
          </ButtonGroup>

          <Button
            icon="folder-open"
            text={'See Saved Files in ' + fileBrowserName}
            onClick={() => {
              window.electron.ipcRenderer.sendMessage(
                'utilities.open-internal-path-in-default-program',
                props.capture.downloadLocation,
              );
            }}
          />
        </div>

        <div className="image-file-download-show-fragment__media">
          {captureImageUrl == null && (
            <div className="image-file-download-show-fragment__media__placeholder">
              <Spinner size={SpinnerSize.STANDARD} />
            </div>
          )}

          {captureImageUrl == 'error' && displayedMediaType === 'image' && (
            <div className="image-file-download-show-fragment__media__image-not-found">
              <NonIdealState
                icon="diagnosis"
                title="The Saved Image File Cannot Be Found"
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
                        props.capture.downloadLocation,
                      );
                    }}
                  />
                }
              />
            </div>
          )}

          {captureImageUrl != null &&
            captureImageUrl !== 'error' &&
            displayedMediaType === 'image' && (
              <div className="image-file-download-show-fragment__media__image">
                <FocusedCaptureImageContextMenu
                  capture={props.capture}
                  downloadLocation={props.capture.downloadLocation ?? ''}
                  imagePath={files[0]?.name ?? ''}
                  fileBrowserName={fileBrowserName}
                  toggleButtonsClassName=".image-file-download-show-fragment__toggle-buttons"
                >
                  <img
                    className="image-file-download-show-fragment__media__image__inner"
                    style={{
                      maxWidth:
                        imageDimensions.w == null
                          ? '100%'
                          : imageDimensions.w + 'px',
                    }}
                    src={captureImageUrl}
                  />
                </FocusedCaptureImageContextMenu>

                <div className="image-file-download-show-fragment__media__to-top-button">
                  <Button
                    icon="arrow-up"
                    onClick={() => {
                      const toggleButtons = document.querySelectorAll(
                        '.image-file-download-show-fragment__toggle-buttons',
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
        </div>
      </div>
    </div>
  );
};

export default ImageFileDownloadDataProviderCaptureShowPageFragment;
