import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import TodayPage from './pages/TodayPage';
import YesterdayPage from './pages/YesterdayPage';
import DefaultLayout from './layouts/DefaultLayout';
import OnboardingIndexPage from './pages/OnboardingIndexPage';
import SourceShowPage, { SourceShowPageLoader } from './pages/SourceShowPage';
import SourceIndexPage, { SourceIndexPageLoader } from './pages/SourceIndexPage';
import CaptureShowPage, { CaptureShowPageLoader } from './pages/CaptureShowPage';
import SourceCreatePage, { sourceCreatePageDataLoader } from './pages/SourceCreatePage';

const App = () => {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: '/',
          element: <DefaultLayout />,
          children: [
            {
              path: '/onboarding', 
              element: <OnboardingIndexPage />
            },
            {
              path: '/yesterday',
              element: <YesterdayPage />
            },
            {
              path: '/today',
              element: <TodayPage />
            },
            {
              path: '/sources',
              loader: SourceIndexPageLoader,
              element: <SourceIndexPage />
            },
            {
              path: '/sources/create',
              loader: sourceCreatePageDataLoader,
              element: <SourceCreatePage />
            },
            {
              path: '/sources/:sourceId',
              loader: SourceShowPageLoader,
              element: <SourceShowPage />
            },
            {
              path: '/captures/:captureId',
              loader: CaptureShowPageLoader,
              element: <CaptureShowPage />
            },
          ]
        }
      ])}
    />
  );
};

export default App;
