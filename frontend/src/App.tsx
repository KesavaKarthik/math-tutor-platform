import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { ROUTES, ROUTE_PATTERNS } from '@/constants';
import { useAuthSession } from '@/hooks';
import ChapterView from '@/pages/ChapterView';
import Dashboard from '@/pages/Dashboard';
import GlobalChat from '@/pages/GlobalChat';
import LearningMode from '@/pages/LearningMode';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import SocraticMode from '@/pages/SocraticMode';

function App() {
  useAuthSession();

  return (
    <Router>
      <Routes>
        <Route path={ROUTE_PATTERNS.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTE_PATTERNS.LOGIN} element={<Login />} />
        <Route path={ROUTE_PATTERNS.REGISTER} element={<Register />} />

        {/* Dashboard and Learning modes are public so users can browse without logging in */}
        <Route path={ROUTE_PATTERNS.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTE_PATTERNS.CHAPTER} element={<ChapterView />} />
        <Route path={ROUTE_PATTERNS.LEARNING_MODE} element={<LearningMode />} />
        <Route path={ROUTE_PATTERNS.SOCRATIC_MODE} element={<SocraticMode />} />
        <Route path={ROUTE_PATTERNS.CHAT} element={<GlobalChat />} />

        <Route element={<ProtectedRoute />}>
          {/* We will add any strictly protected routes here if needed (e.g., Settings, History) */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
