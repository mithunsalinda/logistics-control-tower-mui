import { Box, Divider, Drawer } from '@mui/material';

import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { DrawerHeader, NavigationMenu } from '../components';
import type { RegionCode } from '../config/regions';
import { navigationItems } from '../shared/constants/navigation';
import TopNavbar from './TopNavbar';

const drawerWidth = 250;

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [region, setRegion] = useState<RegionCode>('EUROPE');
  const handleRegionChange = (newRegion: RegionCode) => {
    setRegion(newRegion);
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
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
        <TopNavbar region={region} onRegionChange={handleRegionChange} />
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
          <Outlet
            context={{
              region,
              onRegionChange: handleRegionChange,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
