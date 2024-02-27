/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: IndexPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/

import useIsMounting from '../../layouts/DefaultLayout/hooks/useIsMounting';
import {
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Spinner, SpinnerSize } from '@blueprintjs/core';
import { useEffect } from 'react';
import getMarchiveIsSetup from '../../layouts/DefaultLayout/functions/getMarchiveIsSetup';

import './index.scss';

export type IndexPageLoaderReturnType = {
  marchiveIsSetup: boolean | null;
};

export const IndexPageLoader =
  async (): Promise<IndexPageLoaderReturnType> => ({
    marchiveIsSetup: await getMarchiveIsSetup(),
  });

const IndexPage = () => {
  const isMounting = useIsMounting();

  const navigate = useNavigate();
  const location = useLocation();

  const { marchiveIsSetup } = useLoaderData() as IndexPageLoaderReturnType;

  useEffect(() => {
    if (marchiveIsSetup == null) return;
    navigate(marchiveIsSetup ? '/sources' : '/onboarding');
  }, [marchiveIsSetup]);

  return (
    <>
      <div className="index__container">
        <Spinner size={SpinnerSize.LARGE} />
      </div>
    </>
  );
};

export default IndexPage;
