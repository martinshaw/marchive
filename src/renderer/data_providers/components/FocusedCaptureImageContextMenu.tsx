/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: FocusedCaptureImageContextMenu.tsx
Created:  2023-09-27T04:34:41.076Z
Modified: 2023-09-27T04:34:41.076Z

Description: description
*/
import { ReactNode } from 'react';
import {
  ContextMenuContentProps,
  ContextMenuProps,
  Menu,
  MenuDivider,
  MenuItem,
  ContextMenu,
} from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { Capture } from '../../../main/database';
import { CaptureAttributes } from '../../../main/database/models/Capture';

type FocusedCaptureImageContextMenuPropsType = {
  capture: Capture | CaptureAttributes,
  downloadLocation: string,
  imagePath: string,
  fileBrowserName: string,
  contextMenuProps?: Omit<ContextMenuProps, 'content' | 'children'>,
  children: ReactNode,
};

const FocusedCaptureImageContextMenu: (
  props: FocusedCaptureImageContextMenuPropsType
) => ReactNode = (
  props
) => {
  const navigate = useNavigate();

  const imageMediaContextMenu = (menuProps: ContextMenuContentProps) => (
    <Menu>
      <MenuItem
        icon="select"
        text="Open in Your Image Viewer"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage(
            'utilities.open-internal-path-in-default-program',
            props.downloadLocation + '/' + props.imagePath
          );
        }}
      />
      <MenuItem
        icon="folder-open"
        text={'See Saved Files in ' + props.fileBrowserName}
        onClick={() => {
          window.electron.ipcRenderer.sendMessage(
            'utilities.open-internal-path-in-default-program',
            props.downloadLocation
          );
        }}
      />
      <MenuDivider />
      <MenuItem
        icon="arrow-up"
        text="Go to Top"
        onClick={() => {
          const toggleButtons = document.querySelectorAll(
            '.blog-article-capture-show-fragment__left__toggle-buttons'
          );
          if (Array.from(toggleButtons).length < 1) return;

          toggleButtons[0].scrollIntoView({
            behavior: 'smooth',
          });
        }}
      />
      <MenuItem
        icon="arrow-left"
        text="Go Back"
        onClick={() => {
          navigate(-1);
        }}
      />
    </Menu>
  );

  return (
    <ContextMenu {...props.contextMenuProps ?? {}} content={imageMediaContextMenu}>
      {props.children}
    </ContextMenu>
  );
};

export default FocusedCaptureImageContextMenu;
