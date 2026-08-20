import { Navigate, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';

import AppShell from '../layout/AppShell';
import { PageLoader } from '../components';
import ProtectedRoute from '../routes/ProtectedRoute';
import { useAppSelector } from '../store';

const Admin = lazy(() => import('../features/admin/Admin'));
const Capacity = lazy(() => import('../features/capacity/Capacity'));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const Exceptions = lazy(() => import('../features/exceptions/Exceptions'));
const Facilities = lazy(() => import('../features/facilities/Facilities'));
const FleetAndDrivers = lazy(() => import('../features/FleetAndDrivers'));
const LiveMap = lazy(() => import('../features/map/LiveMap'));
const Login = lazy(() => import('../features/login/Login'));
const RoutePlanning = lazy(() => import('../features/routes/RoutePlanning'));
const Shipments = lazy(() => import('../features/shipments'));

const HomeRedirect = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <Navigate replace to={isAuthenticated ? '/dashboard' : '/login'} />;
};

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader variant="full" />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/exceptions" element={<Exceptions />} />
            <Route element={<ProtectedRoute allowedRoles={['Dispatcher', 'Operations Manager', 'Planner', 'Administrator', 'Read-only Viewer']} />}>
              <Route path="/routes" element={<RoutePlanning />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Dispatcher', 'Operations Manager', 'Administrator', 'Read-only Viewer']} />}>
              <Route path="/fleet" element={<FleetAndDrivers />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Warehouse Coordinator', 'Operations Manager', 'Administrator', 'Read-only Viewer']} />}>
              <Route path="/facilities" element={<Facilities />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Planner', 'Operations Manager', 'Administrator', 'Read-only Viewer']} />}>
              <Route path="/capacity" element={<Capacity />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </Suspense>
  );
}
