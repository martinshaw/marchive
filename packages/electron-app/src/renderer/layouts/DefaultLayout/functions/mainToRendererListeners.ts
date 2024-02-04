/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: mainToRendererListeners.ts
Created:  2023-09-11T09:43:10.689Z
Modified: 2023-09-11T09:43:10.689Z

Description: description
*/

import { RefObject } from "react";
import { Location, NavigateFunction } from "react-router-dom";

const mainToRendererListeners = (
  location: Location,
  navigate: NavigateFunction,
  layoutRef: RefObject<HTMLDivElement>
) => {
  const focusedWindowNavigateRemoveListener = window.electron.ipcRenderer.on(
    'renderer.focused-window.navigate',
    (url) => {
      if (typeof url !== 'string') return;
      navigate(url);
    }
  );

  const focusedWindowIsFocusedRemoveListener = window.electron.ipcRenderer.on(
    'renderer.focused-window.is-focused',
    () => {
      if (layoutRef.current == null) return;
      layoutRef.current.classList.remove('grayscale');
    }
  );

  const focusedWindowIsBlurredRemoveListener = window.electron.ipcRenderer.on(
    'renderer.focused-window.is-blurred',
    () => {
      if (layoutRef.current == null) return;
      layoutRef.current.classList.add('grayscale');
    }
  );

  const removeListeners = (): void => {
    focusedWindowNavigateRemoveListener();
    focusedWindowIsFocusedRemoveListener();
    focusedWindowIsBlurredRemoveListener();
  }

  return {removeListeners};
};

export default mainToRendererListeners;
