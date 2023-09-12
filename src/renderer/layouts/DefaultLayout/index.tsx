/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { useCallback, useEffect, useState } from 'react';
import { Button, Navbar } from '@blueprintjs/core';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import isDarkMode from './functions/isDarkMode';
import marchiveIsSetup from './functions/marchiveIsSetup';
import { useAsyncMemo } from "use-async-memo"
import getSourcesCount from '../../pages/SourceIndexPage/functions/getSourcesCount';
import scheduleRunProcessEvents from './functions/scheduleRunProcessEvents';
import capturePartRunProcessEvents from './functions/capturePartRunProcessEvents';
import { ProcessesReplyOngoingEventDataType } from '../../../main/app/actions/Process/ProcessStartProcess';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';

const DefaultLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const checkIfPageStateShouldRefreshDueToScheduleStatusChange = useCallback(
    (ongoingEvent: ProcessesReplyOngoingEventDataType) => {
      const shouldRefreshPageOnScheduleStatusChanges =
        location.pathname.startsWith('/sources') &&
        location.pathname.startsWith('/sources/create') === false &&
        location.pathname.startsWith('/sources/edit') === false &&
        location.pathname.startsWith('/sources/delete') === false;;

      const ongoingEventCaptureRanSuccessfullyRegex = /Capture ID [\d]* ran successfully/gm;
      let ongoingEventCaptureRanSuccessfullyMatches;

      while ((ongoingEventCaptureRanSuccessfullyMatches = ongoingEventCaptureRanSuccessfullyRegex.exec(ongoingEvent.data)) !== null) {
        if (ongoingEventCaptureRanSuccessfullyMatches.index === ongoingEventCaptureRanSuccessfullyRegex.lastIndex) ongoingEventCaptureRanSuccessfullyRegex.lastIndex++;
        if (ongoingEventCaptureRanSuccessfullyMatches != null && shouldRefreshPageOnScheduleStatusChanges) navigate(0)
      }

      const startedNewCaptureRegex = /Created new Capture with ID/gm
      let startedNewCaptureMatches;

      while ((startedNewCaptureMatches = startedNewCaptureRegex.exec(ongoingEvent.data)) !== null) {
        if (startedNewCaptureMatches.index === startedNewCaptureRegex.lastIndex) startedNewCaptureRegex.lastIndex++;
        if (startedNewCaptureMatches != null && shouldRefreshPageOnScheduleStatusChanges) navigate(0)
      }
    } ,
    [location.pathname]
  )

  useEffect(() => {
    const {removeListeners} = scheduleRunProcessEvents(
      (connectionInfo) => { /* */ },
      (ongoingEvent) => {

        checkIfPageStateShouldRefreshDueToScheduleStatusChange(ongoingEvent);

      },
      (error) => { /* */ },
    )

    return () => { removeListeners() }
  }, [location])

  useEffect(() => {
    const {removeListeners} = capturePartRunProcessEvents(
      (connectionInfo) => { /* */ },
      (ongoingEvent) => { /* */ },
      (error) => { /* */ },
    )

    return () => { removeListeners() }
  }, [])

  return (
    <div id="layout" className={loaderData.isDarkMode ? 'bp5-dark' : ''}>
      {loaderData.marchiveIsSetup === true && loaderData.sourcesCount !== null &&
        <Navbar id="navbar">

          <Navbar.Group align="left">
            {loaderData.hasHistory ?
              <Button type='button' icon='arrow-left' onClick={() => navigate(-1)} /> :
              <div style={{width: '37.5px'}}>&nbsp;</div>
            }
          </Navbar.Group>

          <Navbar.Group align='center'>
            <NavLink to="/yesterday">
              {({ isActive }) => (
                <Button type='button' active={isActive} icon="history" text="Yesterday" />
              )}
            </NavLink>
            <NavLink to="/today">
              {({ isActive }) => (
                <Button type='button' active={isActive} icon="calendar" text="Today" />
              )}
            </NavLink>
            <NavLink to="/sources">
              {({ isActive }) => (
                <Button
                  type='button'
                  active={isActive}
                  icon={ loaderData.sourcesCount == null || loaderData.sourcesCount < 1 ? "plus" : "database" }
                  text={ loaderData.sourcesCount == null || loaderData.sourcesCount < 1 ? "Add Source" : "Sources" }
                />
              )}
            </NavLink>
          </Navbar.Group>

          <Navbar.Group align="right">
            {/* <Button type='button' icon='cog' /> */}
            <div style={{width: '37.5px'}}>&nbsp;</div>
          </Navbar.Group>

        </Navbar>
      }

      <div id="page">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
