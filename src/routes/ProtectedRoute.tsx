import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router';

import { useAppSelector } from '../store';
import { canAccess, type UserRole } from '../utils/auth';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const outletContext = useOutletContext<unknown>();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!canAccess(user?.role, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={outletContext} />;
};

export default ProtectedRoute;
