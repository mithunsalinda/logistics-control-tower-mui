import { Navigate, Route, Routes } from 'react-router';

import AppShell from '../layout/AppShell';
import Dashboard from '../features/Dashboard';
import FleetAndDrivers from '../features/FleetAndDrivers';
import Login from '../features/Login';
import Shipments from '../features/shipments';
import Exceptions from '../features/exceptions/Exceptions';
import Facilities from '../features/facilities/Facilities';
import Capacity from '../features/capacity/Capacity';
import Admin from '../features/admin/Admin';
import ProtectedRoute from '../routes/ProtectedRoute';
import { useAppSelector } from '../store';

const HomeRedirect = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <Navigate replace to={isAuthenticated ? '/dashboard' : '/login'} />;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/fleet" element={<FleetAndDrivers />} />
          <Route path="/exceptions" element={<Exceptions />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/capacity" element={<Capacity />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
