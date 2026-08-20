import { Box, Divider, Drawer } from '@mui/material';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { DrawerHeader, NavigationMenu, PageLoader, PageTransitionLoader } from '../components';
import type { RegionCode } from '../config/regions';
import { navigationItems } from '../shared/constants/navigation';
import { useAppSelector } from '../store';
import { canAccess } from '../utils/auth';
import { useThemeMode } from '../theme/themeContext';
import TopNavbar from './TopNavbar';

const drawerWidth = 250;
const regionPreferenceKey = 'logistics.preference.region';

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const { mode: themeMode, toggleMode } = useThemeMode();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [region, setRegion] = useState<RegionCode>(
    () => (localStorage.getItem(regionPreferenceKey) as RegionCode | null) ?? 'EUROPE',
  );
  const [pageTransitionLoading, setPageTransitionLoading] = useState(false);
  const previousPathRef = useRef(location.pathname);

  const visibleNavigationItems = useMemo(
    () => navigationItems.filter((item) => canAccess(user?.role, item.allowedRoles)),
    [user?.role],
  );

  const handleRegionChange = (newRegion: RegionCode) => {
    setRegion(newRegion);
    localStorage.setItem(regionPreferenceKey, newRegion);
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  useEffect(() => {
    if (previousPathRef.current === location.pathname) {
      return;
    }

    previousPathRef.current = location.pathname;
    setPageTransitionLoading(true);

    const timeoutId = window.setTimeout(() => {
      setPageTransitionLoading(false);
    }, 360);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  const drawerContent = (
    <>
      <DrawerHeader />
      <Divider />
        <NavigationMenu
        items={visibleNavigationItems}
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
        backgroundColor: 'var(--app-bg)',
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
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            backgroundColor: 'var(--app-shell)',
          }}
        >
          <TopNavbar
            region={region}
            themeMode={themeMode}
            onRegionChange={handleRegionChange}
            onThemeToggle={toggleMode}
          />
          <Divider />
        </Box>
        <Box
          sx={{
            position: 'relative',
            flexGrow: 1,
            backgroundColor: 'var(--app-bg)',
            padding: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <PageTransitionLoader loading={pageTransitionLoading} />
          <Suspense fallback={<PageLoader />}>
            <Outlet
              context={{
                region,
                onRegionChange: handleRegionChange,
              }}
            />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
