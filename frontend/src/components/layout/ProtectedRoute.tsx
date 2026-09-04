import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store';

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
