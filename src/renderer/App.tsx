import { MemoryRouter as Router, Routes, Route, RouterProvider, createMemoryRouter } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';

import YesterdayPage from './pages/YesterdayPage';
import TodayPage from './pages/TodayPage';
import SourceIndexPage from './pages/SourceIndexPage';
import SourceCreatePage from './pages/SourceCreatePage';
import OnboardingIndexPage from './pages/OnboardingIndexPage';

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
              // TODO: See TODO comment in SourceIndexPage
              // loader: SourceIndexPageLoader,
              element: <SourceIndexPage />
            },
            {
              path: '/sources/create',
              element: <SourceCreatePage />
            },
            {
              path: '/sources/:sourceId',
              element: <SourceCreatePage />
            },
          ]
        }
      ])}
    />
  );
};

export default App;
