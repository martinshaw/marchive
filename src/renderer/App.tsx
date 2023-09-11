import { MemoryRouter as Router, Routes, Route, RouterProvider, createMemoryRouter, createBrowserRouter, createHashRouter } from 'react-router-dom';

import YesterdayPage from './pages/YesterdayPage';
import TodayPage from './pages/TodayPage';
import SourceIndexPage, { SourceIndexPageLoader } from './pages/SourceIndexPage';
import SourceCreatePage, { sourceCreatePageDataLoader } from './pages/SourceCreatePage';
import OnboardingIndexPage from './pages/OnboardingIndexPage';
import DefaultLayout from './layouts/DefaultLayout';
import SourceShowPage, { SourceShowPageLoader } from './pages/SourceShowPage';

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
          ]
        }
      ])}
    />
  );
};

export default App;
