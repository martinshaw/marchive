/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: OnboardingIndexPage.tsx
Created:  2023-08-01T19:56:36.606Z
Modified: 2023-08-01T19:56:36.606Z

Description: description
*/

import { Alignment, Button, H1, H3, Navbar, Text } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

import './index.scss';

const OnboardingIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding">
      <H1 className="onboarding__heading">Marchive</H1>
      <H3 className="onboarding__subheading">The Ultimate Information, News and Media Archiver and Aggregator</H3>
      <div className="onboarding__features">abc</div>
      <div className="onboarding__buttons">
        <Button
          large
          rightIcon="arrow-right"
          onClick={() => { navigate('/sources/create') }}
        >
          Add Your First Source of Information
        </Button>
      </div>
    </div>
  );
};

export default OnboardingIndexPage;
