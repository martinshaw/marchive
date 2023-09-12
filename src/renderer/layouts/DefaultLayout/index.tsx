/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { Button, Navbar, TextArea } from '@blueprintjs/core';
import { NavLink, Outlet, useLoaderData, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import isDarkMode from './functions/isDarkMode';
import marchiveIsSetup from './functions/marchiveIsSetup';
import { useAsyncMemo } from "use-async-memo"
import getSourcesCount from 'renderer/pages/SourceIndexPage/functions/getSourcesCount';
import scheduleRunProcessEvents from './functions/scheduleRunProcessEvents';
import capturePartRunProcessEvents from './functions/capturePartRunProcessEvents';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';

const DefaultLayout = () => {
  const [hasHistory, setHasHistory] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const loaderData: {
    isDarkMode: boolean;
    marchiveIsSetup: boolean | null;
    sourcesCount: number | null;
  } = useAsyncMemo(
    async () => {
      const ignoredLandingPages = ['/', '/today']
      if (hasHistory === false && ignoredLandingPages.includes(location.pathname) === false) setHasHistory(true)

      return {
        isDarkMode: await isDarkMode(),
        marchiveIsSetup: await marchiveIsSetup(),
        sourcesCount: await getSourcesCount(),
      };
    },
    [location.pathname, hasHistory]
  ) ?? {
    isDarkMode: false,
    marchiveIsSetup: null,
    sourcesCount: null,
  }

  useEffect(() => {
    const allowedPaths = ['/onboarding', '/sources'];
    const currentPathIsAllowedPath = allowedPaths.some((allowedPath) => location.pathname.startsWith(allowedPath));
    const shouldForceOnboarding = loaderData.marchiveIsSetup === false && currentPathIsAllowedPath === false;
    if (shouldForceOnboarding) navigate('/onboarding');

    if (location.pathname === '/' && loaderData.sourcesCount != null) navigate('/today');
  }, [loaderData, location.pathname]);

  useEffect(() => {

    const {removeListeners} = scheduleRunProcessEvents(
      (connectionInfo) => {
        // console.log('connectionInfo', connectionInfo)
      },
      (ongoingEvent) => {
        // console.log('ongoingEvent', ongoingEvent)

        const refreshOnCaptureRunSuccessfully = ['/sources']
        const regex = /Capture ID [\d]* ran successfully/gm;
        let ongoingEventCaptureRanSuccessfullyMatches;

        while ((ongoingEventCaptureRanSuccessfullyMatches = regex.exec(ongoingEvent.data)) !== null) {
          if (ongoingEventCaptureRanSuccessfullyMatches.index === regex.lastIndex) regex.lastIndex++;

          if (ongoingEventCaptureRanSuccessfullyMatches != null && refreshOnCaptureRunSuccessfully.includes(location.pathname)) navigate(0)
        }
      },
      (error) => {
        // console.log('error', error)
      },
    )

    return () => { removeListeners() }
  }, [location])

  useEffect(() => {
    const {removeListeners} = capturePartRunProcessEvents(
      (connectionInfo) => { /* */ },
      (ongoingEvent) => { console.log('capturePartRunProcessEvents ongoingEvent', ongoingEvent) },
      (error) => { /* */ },
    )

    return () => { removeListeners() }
  }, [])

  return (
    <div id="layout" className={loaderData.isDarkMode ? 'bp5-dark' : ''}>
      {loaderData.marchiveIsSetup === true && loaderData.sourcesCount !== null &&
        <Navbar id="navbar">

          <Navbar.Group align="left">
            {hasHistory ?
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
