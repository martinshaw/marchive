import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';

import YesterdayPage from './pages/YesterdayPage';
import TodayPage from './pages/TodayPage';
import SourcesIndexPage from './pages/SourcesIndexPage';
import SourcesCreatePage from './pages/SourcesCreatePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/yesterday"
          element={
            <DefaultLayout>
              <YesterdayPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/"
          element={
            <DefaultLayout>
              <TodayPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/sources"
          element={
            <DefaultLayout>
              <SourcesIndexPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/sources/create"
          element={
            <DefaultLayout>
              <SourcesCreatePage />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
