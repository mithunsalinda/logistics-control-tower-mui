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
      }}
    >
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          ml: {
            md: `${drawerWidth}px`,
          },
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: '72px !important',
          }}
        >
          <IconButton
            aria-label="Open navigation menu"
            edge="start"
            onClick={() => setMobileDrawerOpen(true)}
            sx={{
              display: {
                xs: 'inline-flex',
                md: 'none',
              },
              mr: 2,
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Typography
            component="h1"
            sx={{
              flexGrow: 1,
            }}
            variant="h6"
          >
            {currentPageTitle}
          </Typography>

          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              height: 36,
              ml: 1,
              width: 36,
            }}
          >
            {userInitial}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          flexShrink: {
            md: 0,
          },
          width: {
            md: drawerWidth,
          },
        }}
      >
        {/* Mobile navigation */}

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

        {/* Desktop navigation */}

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
          backgroundColor: '#f5f7fb',
          flexGrow: 1,
          minHeight: '100vh',
          padding: {
            xs: 2,
            sm: 3,
          },
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },
        }}
      >
        <Toolbar
          sx={{
            minHeight: '72px !important',
          }}
        />

        <Outlet context={{ region, onRegionChange: setRegion }} />
      </Box>
    </Box>
  );
};

export default AppShell;
