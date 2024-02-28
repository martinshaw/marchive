/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2024-02-27T18:04:21.972Z
Modified: 2024-02-27T18:04:21.972Z

Description: description
*/

import { useNavigate, useRouteError } from 'react-router-dom';
import { useAsyncMemo } from 'use-async-memo';
import isDarkMode from '../layouts/DefaultLayout/functions/isDarkMode';
import getMarchiveIsSetup from '../layouts/DefaultLayout/functions/getMarchiveIsSetup';
import getSourcesCount from '../pages/SourceIndexPage/functions/getSourcesCount';
import {
  BlueprintProvider,
  Button,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import Navbar from '../layouts/DefaultLayout/components/Navbar';
import { createRef } from 'react';

import './index.scss';

const ErrorBoundary = () => {
  const layoutRef = createRef<HTMLDivElement>();

  let error = useRouteError() as Error;

  console.error(error);

  const navigate = useNavigate();

  const loaderData = useAsyncMemo<{
    isDarkMode: boolean | null;
    marchiveIsSetup: boolean | null;
    sourcesCount: number | null;
    hasHistory: boolean;
    platform: string | null;
  }>(
    async () => ({
      isDarkMode: await isDarkMode(),
      marchiveIsSetup: await getMarchiveIsSetup(),
      sourcesCount: await getSourcesCount(),
      hasHistory:
        ['/', '/today', '/sources'].includes(location.pathname) === false,
      platform: window.electron.platform,
    }),
    [location.pathname],
    {
      isDarkMode: null,
      marchiveIsSetup: null,
      sourcesCount: null,
      hasHistory: false,
      platform: null,
    },
  );

  let className = '';

  if (loaderData.isDarkMode) className += ' bp5-dark';
  if (loaderData.platform) className += ` platform-${loaderData.platform}`;

  return (
    <BlueprintProvider>
      <div ref={layoutRef} id="layout" className={className}>
        {loaderData.isDarkMode != null && <Navbar {...loaderData} />}

        {(loaderData.isDarkMode != null || location.pathname === '/') && (
          <div id="page__error">
            <div className="error__container">
              <NonIdealState
                icon="error"
                iconSize={NonIdealStateIconSize.STANDARD}
                title="Something went wrong"
                description={error.message}
                action={
                  <div className="error__buttons">
                    {/* <Button
                      icon="arrow-left"
                      text="Go Back"
                      onClick={() => navigate(-1)}
                    /> */}
                    <Button
                      icon="refresh"
                      text="Retry"
                      onClick={() => navigate(0)}
                    />
                    <Button
                      rightIcon="arrow-right"
                      text="See all Sources"
                      onClick={() => navigate('/sources', { replace: true })}
                    />
                  </div>
                }
              />
            </div>
          </div>
        )}
      </div>
    </BlueprintProvider>
  );
};

export default ErrorBoundary;
