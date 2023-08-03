/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: DefaultLayout.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { ReactNode } from 'react';
import { Button, Navbar } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.scss';

import useIsDarkMode from './hooks/useIsDarkMode';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useIsDarkMode();

  return (
    <div id="layout" className={isDarkMode ? 'bp5-dark' : ''}>
      <Navbar id="navbar">
        <Navbar.Group>
          <NavLink to="/yesterday">
            {({ isActive }) => (
              <Button active={isActive} icon="history" text="Yesterday" />
            )}
          </NavLink>
          <NavLink to="/">
            {({ isActive }) => (
              <Button active={isActive} icon="calendar" text="Today" />
            )}
          </NavLink>
          <NavLink to="/sources">
            {({ isActive }) => (
              <Button active={isActive} icon="database" text="Sources" />
            )}
          </NavLink>
        </Navbar.Group>
      </Navbar>

      <div id="page">{children}</div>
    </div>
  );
};

export default DefaultLayout;
