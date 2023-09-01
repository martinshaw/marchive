/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { Button, Navbar } from '@blueprintjs/core';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useIsDarkMode from './hooks/useIsDarkMode';
import useMarchiveIsSetup from './hooks/useMarchiveIsSetup';
import { useEffect } from 'react';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';

const DefaultLayout = () => {
  const isDarkMode = useIsDarkMode();
  const marchiveIsSetup = useMarchiveIsSetup();

  const navigate = useNavigate();
  useEffect(() => {
    if (marchiveIsSetup === false) navigate('/onboarding');
  }, [marchiveIsSetup, navigate]);

  return (
    <div id="layout" className={isDarkMode ? 'bp5-dark' : ''}>
      {marchiveIsSetup === true &&
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
