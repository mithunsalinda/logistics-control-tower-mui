import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { useState, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { DrawerHeader, NavigationMenu, RegionMenu } from '../components';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/authSlice';
import type { RegionCode } from '../config/regions';
import TopNavbar from './TopNavbar';

const drawerWidth = 250;

interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navigationItems: NavigationItem[] = [
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
    icon: <SettingsRoundedIcon />,
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: <Inventory2RoundedIcon />,
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: <PeopleRoundedIcon />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <SettingsRoundedIcon />,
  },
];

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [region, setRegion] = useState<RegionCode>('EUROPE');

  const currentPageTitle =
    navigationItems.find((item) => item.path === location.pathname)?.label ?? 'Dashboard';

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const userInitial = user?.name?.[0]?.toUpperCase() ?? 'A';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', {
      replace: true,
    });
  };

  const drawerContent = (
    <>
      <DrawerHeader />
      <Divider />
      <NavigationMenu
        items={navigationItems}
        selectedPath={location.pathname}
        onNavigate={handleNavigation}
      />
    </>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f5f7fb',
      }}
    >
      <Box
        component="nav"
        sx={{
          flexShrink: 0,
          width: {
            xs: 0,
            md: drawerWidth,
          },
        }}
      >
        <Drawer
          ModalProps={{
            keepMounted: true,
          }}
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          variant="temporary"
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          open
          variant="permanent"
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
            '& .MuiDrawer-paper': {
              borderRight: '1px solid',
              borderColor: 'divider',
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        <TopNavbar />
        <Divider />
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#f5f7fb',
            padding: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Outlet context={{ region, onRegionChange: setRegion }} />
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
