/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-30T05:10:43.277Z
Modified: 2023-09-30T05:10:43.277Z

Description: description
*/

import { Icon, Tooltip } from '@blueprintjs/core';
import useScheduleRunProcessIsPaused from './hooks/useScheduleRunProcessIsPaused';
import useCapturePartRunProcessIsPaused from './hooks/useCapturePartRunProcessIsPaused';

import './index.scss';

const NavbarProcessesPausedIndicator = () => {
  const scheduleRunProcessIsPaused = useScheduleRunProcessIsPaused();
  const capturePartRunProcessIsPaused = useCapturePartRunProcessIsPaused();

  const direction = window.electron.platform == 'win32' ? 'bottom' : 'top';
  const captionSuffix = `Click on the tray menu icon at the ${direction} of the screen to resume downloads.`
  let caption: string | null = null;
  if (scheduleRunProcessIsPaused && capturePartRunProcessIsPaused) {
    caption =
      `Scheduled sources and queued downloads will not be downloaded. ${captionSuffix}`;
  } else if (scheduleRunProcessIsPaused) {
    caption =
      `Scheduled sources will not be downloaded. ${captionSuffix}`;
  } else if (capturePartRunProcessIsPaused) {
    caption =
      `Queued downloads will not be downloaded. ${captionSuffix}`;
  }

  if (caption === null) return null;

  return (
    <Tooltip position="bottom-right" content={caption}>
      <Icon className="navbar__pause-button" icon="pause" />
    </Tooltip>
  );
};

export default NavbarProcessesPausedIndicator;
