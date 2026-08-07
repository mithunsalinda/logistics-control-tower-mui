import { Navigate, Route, Routes } from 'react-router';

import AppShell from './layout/AppShell';
import Dashboard from './features/Dashboard';
import Login from './features/Login';
import PlaceholderPage from './features/PlaceholderPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { isAuthenticated } from './utils/auth';

const HomeRedirect = () => {
  return <Navigate replace to={isAuthenticated() ? '/dashboard' : '/login'} />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipments" element={<PlaceholderPage title="Shipments" />} />
          <Route path="/orders" element={<PlaceholderPage title="Orders" />} />
          <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

export default App;
