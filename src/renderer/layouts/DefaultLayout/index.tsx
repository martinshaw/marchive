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

const DefaultLayout = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const loaderData: {
    isDarkMode: boolean,
    marchiveIsSetup: boolean | null
  } = useAsyncMemo(
    async () => ({
      isDarkMode: await isDarkMode(),
      marchiveIsSetup: await marchiveIsSetup(),
    }),
    [location]
  ) ?? {
    isDarkMode: false,
    marchiveIsSetup: null,
  }

  useEffect(() => {
    if (loaderData.marchiveIsSetup === false) navigate('/onboarding');
  }, [loaderData.marchiveIsSetup, navigate]);

  return (
    <div id="layout" className={loaderData.isDarkMode ? 'bp5-dark' : ''}>
      {loaderData.marchiveIsSetup === true &&
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
                <Button active={isActive} icon="plus" text="Add" />
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
