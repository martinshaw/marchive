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
  Tooltip,
} from '@blueprintjs/core';
import {
  NavLink,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { toggleMaximize } from '../../functions/focusedWindowControls';
import NavbarProcessesPausedIndicator from './NavbarProcessesPausedIndicator';

import './index.scss';

export type NavbarPropsType = {
  isDarkMode: boolean | null;
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

  const comingSoonTooltipCaption =
    'A curated view of recently saved news, media and information is coming soon.';

  return (
    <BlueprintNavBar id="navbar" onDoubleClick={handleNavbarDoubleClick}>
      {props.marchiveIsSetup === true && props.sourcesCount !== null ? (
        <>
          <NavbarGroup align="left">
            {window.electron.platform === 'win32' && (
              <Tooltip
                content={'More Options...'}
                usePortal
                interactionKind="hover"
                position="bottom-left"
              >
                <Button type="button" icon="menu" onClick={() => openAppMenu()} />
              </Tooltip>
            )}

            {props.hasHistory && isLoadingPage === false && (
              <Tooltip
                content={'Go Back'}
                usePortal
                interactionKind="hover"
                position="bottom-left"
              >
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
              </Tooltip>
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
            <Tooltip
              content={comingSoonTooltipCaption}
              usePortal
              interactionKind="hover"
            >
              <div>
                {/*<NavLink to="/yesterday">*/}
                {/*{({ isActive }) => (*/}
                <Button
                  type="button"
                  // active={isActive}
                  disabled
                  icon="history"
                  text="Yesterday"
                />
                {/*)}*/}
                {/*</NavLink>*/}

                {/*<NavLink to="/today">*/}
                {/*{({ isActive }) => (*/}
                <Button
                  type="button"
                  // active={isActive}
                  disabled
                  icon="calendar"
                  text="Today"
                />
                {/*)}*/}
                {/*</NavLink>*/}
              </div>
            </Tooltip>

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

          <NavbarGroup align="right">
            <NavbarProcessesPausedIndicator />
          </NavbarGroup>
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
