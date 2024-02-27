/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import Navbar from './components/Navbar';
import { useAsyncMemo } from 'use-async-memo';
import { useEffect, createRef } from 'react';
import isDarkMode from './functions/isDarkMode';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import mainToRendererListeners from './functions/mainToRendererListeners';
// import scheduleRunProcessListeners from './functions/scheduleRunProcessListeners';
// import capturePartRunProcessListeners from './functions/capturePartRunProcessListeners';
import { BlueprintProvider } from '@blueprintjs/core';
import useIsMounting from './hooks/useIsMounting';
import getMarchiveIsSetup from './functions/getMarchiveIsSetup';
import getSourcesCount from '../../pages/SourceIndexPage/functions/getSourcesCount';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import 'react-virtualized/styles.css';
import './index.scss';

const DefaultLayout = () => {
  const isMounting = useIsMounting();

  const navigate = useNavigate();
  const location = useLocation();

  const layoutRef = createRef<HTMLDivElement>();

  const loaderData = useAsyncMemo<{
    isDarkMode: boolean | null;
    marchiveIsSetup: boolean | null;
    sourcesCount: number | null;
    hasHistory: boolean;
    platform: string | null;
  }>(
    async () => ({
      isDarkMode: await isDarkMode(),
      marchiveIsSetup: await getMarchiveIsSetup(),
      sourcesCount: await getSourcesCount(),
      hasHistory:
        ['/', '/today', '/sources'].includes(location.pathname) === false,
      platform: window.electron.platform,
    }),
    [location.pathname],
    {
      isDarkMode: null,
      marchiveIsSetup: null,
      sourcesCount: null,
      hasHistory: false,
      platform: null,
    },
  );

  // const checkIfPageStateShouldRefreshDueToScheduleStatusChangeOrCapturePartStatusChange =
  //   useCallback(
  //     (ongoingEvent: string) => {
  //       const shouldRefreshPageOnScheduleStatusChanges =
  //         (location.pathname.startsWith('/sources') &&
  //           location.pathname.startsWith('/sources/create') === false &&
  //           location.pathname.startsWith('/sources/edit') === false &&
  //           location.pathname.startsWith('/sources/delete') === false) ||
  //         location.pathname.startsWith('/captures');

  //       const relevantStdoutMessages = [
  //         /Capture ID [\d]* ran successfully/gm,
  //         /Created new Capture with ID/gm,
  //         /Successfully Processed Capture Part/gm,
  //         /Processing Capture Part/gm,
  //       ];

  //       relevantStdoutMessages.some((relevantStdoutMessage) => {
  //         let matches;

  //         while (
  //           (matches = relevantStdoutMessage.exec(ongoingEvent)) !== null
  //         ) {
  //           if (matches.index === relevantStdoutMessage.lastIndex)
  //             relevantStdoutMessage.lastIndex++;
  //           if (matches != null && shouldRefreshPageOnScheduleStatusChanges) {
  //             navigate(0);
  //             return true;
  //           }
  //         }
  //       });
  //     },
  //     [location.pathname, location.search]
  //   );

  // useEffect(() => {
  //   const { removeListeners } = scheduleRunProcessListeners(
  //     (connectionInfo) => {
  //       /* */
  //     },
  //     (ongoingEvent) => {
  //       checkIfPageStateShouldRefreshDueToScheduleStatusChangeOrCapturePartStatusChange(
  //         ongoingEvent
  //       );
  //     },
  //     (error) => {
  //       /* */
  //     }
  //   );

  //   return () => {
  //     removeListeners();
  //   };
  // }, [location.pathname, location.search, location.hash]);

  // useEffect(() => {
  //   const { removeListeners } = capturePartRunProcessListeners(
  //     (connectionInfo) => {
  //       /* */
  //     },
  //     (ongoingEvent) => {
  //       checkIfPageStateShouldRefreshDueToScheduleStatusChangeOrCapturePartStatusChange(
  //         ongoingEvent
  //       );
  //     },
  //     (error) => {
  //       /* */
  //     }
  //   );

  //   return () => {
  //     removeListeners();
  //   };
  // }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const { removeListeners } = mainToRendererListeners(
      location,
      navigate,
      layoutRef,
    );
    return () => {
      removeListeners();
    };
  }, [location.pathname, location.search, navigate, layoutRef]);

  let className = '';

  if (loaderData.isDarkMode) className += ' bp5-dark';
  if (loaderData.platform) className += ` platform-${loaderData.platform}`;

  return (
    <BlueprintProvider>
      <div ref={layoutRef} id="layout" className={className}>
        {loaderData.isDarkMode != null && <Navbar {...loaderData} />}

        {(loaderData.isDarkMode != null || location.pathname === '/') && (
          <div id="page">
            <Outlet />
          </div>
        )}
      </div>
    </BlueprintProvider>
  );
};

export default DefaultLayout;
