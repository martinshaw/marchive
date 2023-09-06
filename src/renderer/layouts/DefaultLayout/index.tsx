/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { Button, Navbar } from '@blueprintjs/core';
import { NavLink, Outlet, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import isDarkMode from './functions/isDarkMode';
import marchiveIsSetup from './functions/marchiveIsSetup';
import { useAsyncMemo } from "use-async-memo"

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';
import getSourcesCount from 'renderer/pages/SourceIndexPage/functions/getSourcesCount';

const DefaultLayout = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const loaderData: {
    isDarkMode: boolean;
    marchiveIsSetup: boolean | null;
    sourcesCount: number | null;
  } = useAsyncMemo(
    async () => ({
      isDarkMode: await isDarkMode(),
      marchiveIsSetup: await marchiveIsSetup(),
      sourcesCount: await getSourcesCount(),
    }),
    [location.pathname]
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

  return (
    <div id="layout" className={loaderData.isDarkMode ? 'bp5-dark' : ''}>
      {loaderData.marchiveIsSetup === true && loaderData.sourcesCount !== null &&
        <Navbar id="navbar">
          <Navbar.Group>
            <NavLink to="/yesterday">
              {({ isActive }) => (
                <Button active={isActive} icon="history" text="Yesterday" />
              )}
            </NavLink>
            <NavLink to="/today">
              {({ isActive }) => (
                <Button active={isActive} icon="calendar" text="Today" />
              )}
            </NavLink>
            <NavLink to="/sources">
              {({ isActive }) => (
                <Button
                  active={isActive}
                  icon={ loaderData.sourcesCount == null || loaderData.sourcesCount < 1 ? "plus" : "database" }
                  text={ loaderData.sourcesCount == null || loaderData.sourcesCount < 1 ? "Add Source" : "Sources" }
                />
              )}
            </NavLink>
          </Navbar.Group>
        </Navbar>
      }

      <div id="page"><Outlet /></div>
    </div>
  );
};

export default DefaultLayout;
