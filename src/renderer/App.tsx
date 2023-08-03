import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';

import YesterdayPage from './pages/YesterdayPage';
import TodayPage from './pages/TodayPage';
import SourcesPage from './pages/SourcesPage';

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
              <SourcesPage />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
