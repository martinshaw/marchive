/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CopyableExternalUrlLinkText.tsx
Created:  2023-09-20T01:16:40.920Z
Modified: 2023-09-20T01:16:40.920Z

Description: description
*/

import { ContextMenu, Menu, MenuItem, Text } from '@blueprintjs/core';
import openExternalUrlInBrowser from '../functions/openExternalUrlInBrowser';
import AppToaster from '../../../../renderer/toaster';

export type CopyableExternalUrlLinkTextPropsType = {
  url: string;
  text?: string;
};

export const CopyableExternalLinkCopyLinkMenuItem = (
  props: CopyableExternalUrlLinkTextPropsType
) => {
  return (
    <MenuItem
      icon="clipboard"
      text="Copy Link"
      onClick={() => {
        navigator.clipboard.writeText(props.url);
        AppToaster.show({
          message:
            'The link has been copied. You can now paste it anywhere. 🙂',
          intent: 'success',
        });
      }}
    />
  );
};

const CopyableExternalUrlLinkText = (
  props: CopyableExternalUrlLinkTextPropsType
) => {
  return (
    <ContextMenu
      style={{ width: '100%' }}
      content={
        <Menu>
          <CopyableExternalLinkCopyLinkMenuItem {...props} />
        </Menu>
      }
    >
      <Text
        ellipsize
        onClick={() => {
          openExternalUrlInBrowser(props.url);
        }}
      >
        {props.text ?? props.url}
      </Text>
    </ContextMenu>
  );
};

export default CopyableExternalUrlLinkText;
