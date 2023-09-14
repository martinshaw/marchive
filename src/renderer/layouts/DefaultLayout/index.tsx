/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import Navbar from './components/Navbar';
import { useAsyncMemo } from "use-async-memo"
import { useCallback, useEffect } from 'react';
import isDarkMode from './functions/isDarkMode';
import marchiveIsSetup from './functions/marchiveIsSetup';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import getSourcesCount from '../../pages/SourceIndexPage/functions/getSourcesCount';
import scheduleRunProcessListeners from './functions/scheduleRunProcessListeners';
import capturePartRunProcessListeners from './functions/capturePartRunProcessListeners';
import { ProcessesReplyOngoingEventDataType } from '../../../main/app/actions/Process/ProcessStartProcess';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'react-virtualized/styles.css';
import './index.scss';
import mainToRendererListeners from './functions/mainToRendererListeners';
import { createRef } from 'react';

const DefaultLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const layoutRef = createRef<HTMLDivElement>();

  const loaderData: {
    isDarkMode: boolean;
    marchiveIsSetup: boolean | null;
    sourcesCount: number | null;
    hasHistory: boolean;
  } = useAsyncMemo(
    async () => {
      let hasHistory = false;
      const ignoredLandingPages = ['/', '/today']
      if (hasHistory === false && ignoredLandingPages.includes(location.pathname) === false) hasHistory = true;

      return {
        isDarkMode: await isDarkMode(),
        marchiveIsSetup: await marchiveIsSetup(),
        sourcesCount: await getSourcesCount(),
        hasHistory,
      };
    },
    [location.pathname]
  ) ?? {
    isDarkMode: false,
    marchiveIsSetup: null,
    sourcesCount: null,
    hasHistory: false,
  }

  useEffect(() => {
    const allowedPaths = ['/onboarding', '/sources'];
    const currentPathIsAllowedPath = allowedPaths.some((allowedPath) => location.pathname.startsWith(allowedPath));
    const shouldForceOnboarding = loaderData.marchiveIsSetup === false && currentPathIsAllowedPath === false;
    if (shouldForceOnboarding) navigate('/onboarding');

    if (location.pathname === '/' && loaderData.sourcesCount != null) navigate('/today');
  }, [loaderData, location.pathname]);

  const checkIfPageStateShouldRefreshDueToScheduleStatusChangeOrCapturePartStatusChange = useCallback(
    (ongoingEvent: ProcessesReplyOngoingEventDataType) => {
      const shouldRefreshPageOnScheduleStatusChanges =
        (
          location.pathname.startsWith('/sources') &&
          location.pathname.startsWith('/sources/create') === false &&
          location.pathname.startsWith('/sources/edit') === false &&
          location.pathname.startsWith('/sources/delete') === false
        ) || (
          location.pathname.startsWith('/captures')
        );

      const relevantStdoutMessages = [
        /Capture ID [\d]* ran successfully/gm,
        /Created new Capture with ID/gm,
        /Successfully Processed Capture Part/gm,
        /Processing Capture Part/gm,
      ];

      relevantStdoutMessages.some((relevantStdoutMessage) => {
        let matches;

        while ((matches = relevantStdoutMessage.exec(ongoingEvent.data)) !== null) {
          if (matches.index === relevantStdoutMessage.lastIndex) relevantStdoutMessage.lastIndex++;
          if (matches != null && shouldRefreshPageOnScheduleStatusChanges) {
            navigate(0);
            return true;
          }
        }
      });
    },
    [location.pathname]
  )

  useEffect(() => {
    const {removeListeners} = scheduleRunProcessListeners(
      (connectionInfo) => { /* */ },
      (ongoingEvent) => {

        checkIfPageStateShouldRefreshDueToScheduleStatusChangeOrCapturePartStatusChange(ongoingEvent);

      },
      (error) => { /* */ },
    )

    return () => { removeListeners() }
  }, [location])

  useEffect(() => {
    const {removeListeners} = capturePartRunProcessListeners(
      (connectionInfo) => { /* */ },
      (ongoingEvent) => {

        checkIfPageStateShouldRefreshDueToScheduleStatusChangeOrCapturePartStatusChange(ongoingEvent);

      },
      (error) => { /* */ },
    )

    return () => { removeListeners() }
  }, [])

  useEffect(() => {
    const {removeListeners} = mainToRendererListeners(location, navigate, layoutRef);
    return () => { removeListeners() }
  }, [location, navigate, layoutRef])

  return (
    <div ref={layoutRef} id="layout" className={loaderData.isDarkMode ? 'bp5-dark' : ''}>
      <Navbar {...loaderData} />

      <div id="page">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
