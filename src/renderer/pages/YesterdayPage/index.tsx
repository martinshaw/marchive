/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: YesterdayPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import { Alignment, Button, Navbar, Text } from '@blueprintjs/core';

import './index.scss';
import { Navigate } from 'react-router-dom';

const YesterdayPage = () => {

  /**
   * TODO: Why today tomorrow - I have an idea that the ideal Marchive would have a ‘Today’ and ‘Tomorrow’ tab - But no-one is currently using it -
   *   the objective is to quickly get it out so that it may make money and so that I can justify going to the gym (once a version is shared to
   *   friends / dad) - ‘Today’ and ‘Tomorrow’ tabs are just redesigns of existing functionality - they add convenience but no new
   *   functionality - comment their buttons out on this version and focus on adding bare functionality (other Data Providers),
   *   testing then distribute it.
   *
   * Remove this redirect once the page has been implement.
   * Replace similar TODO comments
   */
  return (
    <Navigate to="/sources" replace={true} />
  )

};

export default YesterdayPage;
