import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';

import YesterdayPage from './pages/YesterdayPage';
import TodayPage from './pages/TodayPage';
import SourceIndexPage from './pages/SourceIndexPage';
import SchedulesCreateSourcePage from './pages/SourceCreatePage';
import SourceCreatePage from './pages/SourceCreatePage';

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
              <SourceIndexPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/sources/create"
          element={
            <DefaultLayout>
              <SourceCreatePage />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
