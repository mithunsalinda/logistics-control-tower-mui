import type { ReactNode } from 'react';
import type { UserRole } from '../../utils/auth';

import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';

export interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
  allowedRoles?: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardRoundedIcon />,
  },
  {
    label: 'Live Map',
    path: '/map',
    icon: <MapRoundedIcon />,
    allowedRoles: ['Dispatcher', 'Operations Manager', 'Administrator', 'Read-only Viewer'],
  },
  {
    label: 'Shipments',
    path: '/shipments',
    icon: <LocalShippingRoundedIcon />,
  },
  {
    label: 'Route Planning',
    path: '/routes',
    icon: <RouteRoundedIcon />,
    allowedRoles: ['Dispatcher', 'Operations Manager', 'Planner', 'Administrator', 'Read-only Viewer'],
  },
  {
    label: 'Fleet & Drivers',
    path: '/fleet',
    icon: <LocalShippingRoundedIcon />,
    allowedRoles: ['Dispatcher', 'Operations Manager', 'Administrator', 'Read-only Viewer'],
  },
  {
    label: 'Exceptions',
    path: '/exceptions',
    icon: <ErrorRoundedIcon />,
  },
  {
    label: 'Facilities',
    path: '/facilities',
    icon: <FactoryRoundedIcon />,
    allowedRoles: ['Warehouse Coordinator', 'Operations Manager', 'Administrator', 'Read-only Viewer'],
  },
  {
    label: 'Capacity',
    path: '/capacity',
    icon: <StackedBarChartRoundedIcon />,
    allowedRoles: ['Planner', 'Operations Manager', 'Administrator', 'Read-only Viewer'],
  },
  {
    label: 'Administration',
    path: '/admin',
    icon: <AdminPanelSettingsRoundedIcon />,
    allowedRoles: ['Administrator'],
  },
];
