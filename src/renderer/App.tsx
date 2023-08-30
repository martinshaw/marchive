import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';

import YesterdayPage from './pages/YesterdayPage';
import TodayPage from './pages/TodayPage';
import SourcesIndexPage from './pages/ScheduleIndexPage';
import SourcesCreatePage from './pages/ScheduleCreateSourcePage';
import ScheduleIndexPage from './pages/ScheduleIndexPage';
import SchedulesCreateSourcePage from './pages/ScheduleCreateSourcePage';

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
          path="/schedules"
          element={
            <DefaultLayout>
              <ScheduleIndexPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/schedules/create/source"
          element={
            <DefaultLayout>
              <SchedulesCreateSourcePage />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
