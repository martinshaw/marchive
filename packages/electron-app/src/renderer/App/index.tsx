import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { IndexPageLoader } from '../pages/IndexPage';
import DefaultLayout from '../layouts/DefaultLayout';
import OnboardingIndexPage from '../pages/OnboardingIndexPage';
import SourceShowPage, { SourceShowPageLoader } from '../pages/SourceShowPage';
import SourceIndexPage, {
  SourceIndexPageLoader,
} from '../pages/SourceIndexPage';
import CaptureShowPage, {
  CaptureShowPageLoader,
} from '../pages/CaptureShowPage';
import SourceCreatePage, {
  sourceCreatePageDataLoader,
} from '../pages/SourceCreatePage';
import IndexPage from '../pages/IndexPage';
import ErrorBoundary from '../ErrorBoundary';

const App = () => {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          element: <DefaultLayout />,
          errorElement: <ErrorBoundary />,
          children: [
            {
              path: '/',
              loader: IndexPageLoader,
              element: <IndexPage />,
            },
            {
              path: '/onboarding',
              element: <OnboardingIndexPage />,
            },
            {
              path: '/sources',
              loader: SourceIndexPageLoader,
              element: <SourceIndexPage />,
            },
            {
              path: '/sources/create',
              loader: sourceCreatePageDataLoader,
              element: <SourceCreatePage />,
            },
            {
              path: '/sources/:sourceId',
              loader: SourceShowPageLoader,
              element: <SourceShowPage />,
            },
            {
              path: '/captures/:captureId',
              loader: CaptureShowPageLoader,
              element: <CaptureShowPage />,
            },
          ],
        },
      ])}
    />
  );
};

export default App;
