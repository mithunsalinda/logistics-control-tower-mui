import type { ReactNode } from 'react';

import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import FactoryRoundedIcon from '@mui/icons-material/FactoryRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import StackedBarChartRoundedIcon from '@mui/icons-material/StackedBarChartRounded';

export interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardRoundedIcon />,
  },
  {
    label: 'Shipments',
    path: '/shipments',
    icon: <LocalShippingRoundedIcon />,
  },
  {
    label: 'Fleet & Drivers',
    path: '/fleet',
    icon: <LocalShippingRoundedIcon />,
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
  },
  {
    label: 'Capacity',
    path: '/capacity',
    icon: <StackedBarChartRoundedIcon />,
  },
  {
    label: 'Administration',
    path: '/admin',
    icon: <AdminPanelSettingsRoundedIcon />,
  },
];
