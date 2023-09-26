/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Navbar.tsx
Created:  2023-09-12T16:06:40.138Z
Modified: 2023-09-12T16:06:40.138Z

Description: description
*/

import { useCallback, MouseEvent as ReactMouseEvent } from 'react';
import {
  Button,
  Navbar as BlueprintNavBar,
  NavbarGroup,
  Spinner,
  SpinnerSize,
  MenuItem,
  Menu,
  ContextMenu,
} from '@blueprintjs/core';
import {
  NavLink,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { toggleMaximize } from '../../functions/focusedWindowControls';

import './index.scss';

export type NavbarPropsType = {
  marchiveIsSetup: boolean | null;
  sourcesCount: number | null;
  hasHistory: boolean;
};

const Navbar = (props: NavbarPropsType) => {
  const handleNavbarDoubleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();

      toggleMaximize();
    },
    []
  );

  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();

  const locationCaptions: { [key: string]: string } = {
    '/onboarding': 'Welcome!',
    '/sources/create':
      'Pick The First Source of Information for Your Marchive...',
  };

  const isLoadingPage = navigation.state === 'loading';

  const openAppMenu = useCallback(() => {
    window.electron.ipcRenderer.sendMessage(
      'utilities.focused-window.open-application-menu'
    );
  }, []);

  return (
    <BlueprintNavBar id="navbar" onDoubleClick={handleNavbarDoubleClick}>
      {props.marchiveIsSetup === true && props.sourcesCount !== null ? (
        <>
          <NavbarGroup align="left">
            {window.electron.platform === 'win32' && (
              <Button type="button" icon="menu" onClick={() => openAppMenu()} />
            )}

            {props.hasHistory && isLoadingPage === false && (
              <ContextMenu
                content={
                  <Menu>
                    <MenuItem
                      icon="refresh"
                      text="Refresh Information"
                      onClick={() => navigate(0)}
                    />
                  </Menu>
                }
              >
                <Button
                  type="button"
                  icon="arrow-left"
                  onClick={() => navigate(-1)}
                />
              </ContextMenu>
            )}
            {isLoadingPage && (
              <Button
                type="button"
                icon={<Spinner size={SpinnerSize.SMALL} />}
                disabled
              />
            )}
          </NavbarGroup>

          <NavbarGroup align="center">
            <NavLink to="/yesterday">
              {({ isActive }) => (
                <Button
                  type="button"
                  active={isActive}
                  icon="history"
                  text="Yesterday"
                />
              )}
            </NavLink>
            <NavLink to="/today">
              {({ isActive }) => (
                <Button
                  type="button"
                  active={isActive}
                  icon="calendar"
                  text="Today"
                />
              )}
            </NavLink>
            <NavLink to="/sources">
              {({ isActive }) => (
                <Button
                  type="button"
                  active={isActive}
                  icon={
                    props.sourcesCount == null || props.sourcesCount < 1
                      ? 'plus'
                      : 'database'
                  }
                  text={
                    props.sourcesCount == null || props.sourcesCount < 1
                      ? 'Add Source'
                      : 'Sources'
                  }
                />
              )}
            </NavLink>
          </NavbarGroup>

          <NavbarGroup align="right">{/* */}</NavbarGroup>
        </>
      ) : (
        <div style={{ textAlign: 'center', width: '100%' }}>
          {locationCaptions[location.pathname] || ''}
        </div>
      )}
    </BlueprintNavBar>
  );
};

export default Navbar;
