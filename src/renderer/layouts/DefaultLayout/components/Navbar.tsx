/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Navbar.tsx
Created:  2023-09-12T16:06:40.138Z
Modified: 2023-09-12T16:06:40.138Z

Description: description
*/

import { useCallback, MouseEvent as ReactMouseEvent} from 'react';
import { Button, Navbar as BlueprintNavBar, NavbarGroup } from '@blueprintjs/core';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toggleMaximize } from '.././functions/focusedWindowControls';

export type NavbarPropsType = {
  marchiveIsSetup: boolean | null;
  sourcesCount: number | null;
  hasHistory: boolean;
};

const Navbar = (props: NavbarPropsType) => {

  // const handleNavbarClick = useCallback(
  //   (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //     event.preventDefault();
  //   }, []
  // )

  const handleNavbarDoubleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      console.log(event.currentTarget)

      toggleMaximize();
    }, []
  )

  const navigate = useNavigate();
  const location = useLocation();

  const locationCaptions: {[key: string]: string} = {
    '/onboarding': 'Welcome!',
    '/sources/create': 'Pick The First Source of Information for Your Marchive...'
  };

  return (
    <BlueprintNavBar id="navbar"/* onClick={handleNavbarClick}*/ onDoubleClick={handleNavbarDoubleClick}>
      {
        (props.marchiveIsSetup === true && props.sourcesCount !== null) ?
          <>
            <NavbarGroup align="left">
              {props.hasHistory ?
                <Button type='button' icon='arrow-left' onClick={() => navigate(-1)} /> :
                <div style={{width: '37.5px'}}>&nbsp;</div>
              }
            </NavbarGroup>

            <NavbarGroup align='center'>
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
                    icon={ props.sourcesCount == null || props.sourcesCount < 1 ? "plus" : "database" }
                    text={ props.sourcesCount == null || props.sourcesCount < 1 ? "Add Source" : "Sources" }
                  />
                )}
              </NavLink>
            </NavbarGroup>

            <NavbarGroup align="right">
              {/* <Button type='button' icon='cog' /> */}
              <div style={{width: '37.5px'}}>&nbsp;</div>
            </NavbarGroup>
          </>:
          <div style={{textAlign: 'center', width: '100%'}}>{locationCaptions[location.pathname] || ''}</div>
      }
    </BlueprintNavBar>
  );
}

export default Navbar;
