import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  DarkModeOutlined,
  LightModeOutlined,
  LogoutRounded,
  NotificationsNoneRounded,
  PersonOutlineRounded,
  SearchRounded,
  WarningRounded,
} from '@mui/icons-material';

import { Badge, Box, Button, Chip, Drawer, IconButton, InputBase, MenuItem, Select, Stack, Typography } from '@mui/material';

import type { RegionCode } from '../config/regions';
import RegionSelector from '../components/map/RegionSelector';
import {
  useGetExceptionsQuery,
  useGetFleetQuery,
  useGetRoutePlansQuery,
  useGlobalSearchQuery,
  logout,
  useAppDispatch,
  useAppSelector,
  useUpdateExceptionMutation,
  type ExceptionItem,
} from '../store';

interface TopNavbarProps {
  region: RegionCode;
  themeMode: string;
  onRegionChange: (region: RegionCode) => void;
  onThemeToggle: () => void;
}

export default function TopNavbar({ region, themeMode, onRegionChange, onThemeToggle }: TopNavbarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: exceptions = [] } = useGetExceptionsQuery(undefined, { pollingInterval: 15000 });
  const { data: fleet = [] } = useGetFleetQuery();
  const { data: routePlans = [] } = useGetRoutePlansQuery();
  const [updateException] = useUpdateExceptionMutation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { data: searchResults = [] } = useGlobalSearchQuery(searchText);

  const notifications = useMemo(() => {
    const exceptionNotifications = exceptions
      .filter((exception) => exception.status !== 'Resolved')
      .map((exception) => ({
        id: exception.id,
        title: exception.title,
        domain: exception.domain,
        severity: exception.severity,
        description: `${exception.shipmentId} / ${exception.status}`,
        timestamp: exception.timestamp,
        source: exception,
        persistent: exception.severity === 'Critical' && exception.status === 'New',
      }));

    const fleetNotifications = fleet
      .filter((vehicle) => vehicle.engineFaults.length > 0 || vehicle.fuelLevel <= 25 || vehicle.status === 'Offline')
      .map((vehicle) => ({
        id: `fleet-${vehicle.id}`,
        title: `${vehicle.id} health alert`,
        domain: 'Fleet',
        severity: vehicle.status === 'Offline' || vehicle.engineFaults.length > 0 ? 'High' : 'Medium',
        description: `${vehicle.driver} / ${vehicle.depot}`,
        timestamp: vehicle.telemetry,
        persistent: false,
      }));

    const routeNotifications = routePlans
      .flatMap((plan) =>
        plan.conflicts.map((conflict) => ({
          id: conflict.id,
          title: 'Route assignment conflict',
          domain: 'Routes',
          severity: conflict.severity,
          description: `${conflict.vehicleId} / ${conflict.shipmentIds.join(' + ')}`,
          timestamp: conflict.windowStart,
          persistent: conflict.severity === 'Critical',
        })),
      );

    return [...exceptionNotifications, ...fleetNotifications, ...routeNotifications]
      .filter((item) => item.persistent || !clearedIds.includes(item.id))
      .filter((item) => domainFilter === 'All' || item.domain === domainFilter)
      .sort((left, right) => {
        const severityDelta = getSeverityRank(right.severity) - getSeverityRank(left.severity);

        if (severityDelta !== 0) {
          return severityDelta;
        }

        return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
      });
  }, [clearedIds, domainFilter, exceptions, fleet, routePlans]);

  const unreadCount = notifications.length;
  const domains = ['All', ...Array.from(new Set(notifications.map((item) => item.domain))).sort()];

  const handleClearAll = () => {
    setClearedIds((current) => [
      ...current,
      ...notifications.filter((item) => !item.persistent).map((item) => item.id),
    ]);
  };

  const handleAcknowledgeCritical = async (notification: NotificationItem) => {
    if (!notification.source) {
      return;
    }

    await updateException({ id: notification.source.id, status: 'Acknowledged' });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'var(--app-shell)',
        borderTop: '1px solid var(--app-border)',
        px: {
          xs: 1,
          sm: 1.5,
          md: 1.75,
        },
        py: 1.45,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: {
            xs: 'wrap',
            lg: 'nowrap',
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: {
              xs: '100%',
              lg: 400,
            },
            position: 'relative',
            height: 36,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--app-surface)',
            border: '1px solid var(--app-border)',
            borderRadius: '10px',
            px: 2,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
            '&:focus-within': {
              borderColor: '#8da9c2',
            },
          }}
        >
          <SearchRounded
            sx={{
              flexShrink: 0,
              color: 'var(--app-text)',
              fontSize: 16,
            }}
          />

          <Box
            sx={{
              width: '1px',
              height: 30,
              mx: 1.5,
              backgroundColor: 'var(--app-border)',
            }}
          />

          <InputBase
            fullWidth
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search shipment, order, asset or facility..."
            inputProps={{
              'aria-label': 'Search shipment, order, asset or facility',
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              color: '#1b2d44',
              fontSize: {
                xs: 10,
                md: 14,
              },
              '& input': {
                p: 0,
              },
              '& input::placeholder': {
                color: '#677a91',
                opacity: 1,
              },
            }}
          />

          <Box
            sx={{
              flexShrink: 0,
              height: 27,
              minWidth: 52,
              ml: 1.5,
              px: 0.8,
              display: {
                xs: 'none',
                sm: 'flex',
              },
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #d8e2eb',
              borderRadius: '10px',
              backgroundColor: 'var(--app-surface-muted)',
            }}
          >
            <Typography
              component="span"
              sx={{
                color: 'var(--app-text-soft)',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              ⌘ K
            </Typography>
          </Box>
          {searchFocused && searchText.trim().length >= 2 && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 44,
                zIndex: (theme) => theme.zIndex.tooltip,
                border: '1px solid var(--app-border)',
                borderRadius: '10px',
                backgroundColor: 'var(--app-surface)',
                boxShadow: '0 16px 38px rgba(20, 40, 62, 0.16)',
                overflow: 'hidden',
              }}
            >
              {searchResults.length === 0 ? (
                <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 13, p: 1.4 }}>
                  No matching shipments, orders, assets or facilities.
                </Typography>
              ) : (
                searchResults.map((result) => (
                  <Box
                    key={`${result.domain}-${result.id}`}
                    component="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setSearchFocused(false);
                      setSearchText('');
                      navigate(result.path);
                    }}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      border: 'none',
                      borderBottom: '1px solid var(--app-border-soft)',
                      backgroundColor: 'var(--app-surface)',
                      p: 1.1,
                      textAlign: 'left',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'var(--app-hover)' },
                    }}
                  >
                    <Chip size="small" label={result.domain} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ color: 'var(--app-text)', fontSize: 13, fontWeight: 900 }}>
                        {result.title}
                      </Typography>
                      <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 11 }}>
                        {result.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
        <RegionSelector region={region} onChange={onRegionChange} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <ActionButton
            ariaLabel="Toggle theme"
            icon={themeMode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            onClick={onThemeToggle}
          />
          <Badge
            badgeContent={unreadCount}
            color="error"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                minWidth: 23,
                height: 23,
                px: 0.6,
                borderRadius: '50%',
                top: 6,
                right: 6,
                backgroundColor: '#ff6676',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                border: '2px solid var(--app-shell)',
              },
            }}
          >
            <ActionButton
              ariaLabel="Notifications"
              icon={<NotificationsNoneRounded />}
              onClick={() => setNotificationOpen(true)}
            />
          </Badge>
          <Box
            sx={{
              width: '1px',
              height: 48,
              mx: 0.2,
              backgroundColor: 'var(--app-border)',
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          />
          <Box
            sx={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 1.4,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 157, 152, 0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#009d98',
              }}
            >
              <PersonOutlineRounded
                sx={{
                  fontSize: 18,
                }}
              />
            </Box>

            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
                minWidth: 96,
              }}
            >
              <Typography
                sx={{
                  color: 'var(--app-text)',
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {user?.name ?? 'Dispatcher'}
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  color: 'var(--app-text-muted)',
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                {user?.role ?? 'Dispatcher'} / {themeMode}
              </Typography>
            </Box>

            <IconButton
              aria-label="Logout"
              onClick={handleLogout}
              sx={{
                width: 16,
                height: 16,
                color: 'var(--app-text-muted)',
                '&:hover': {
                  color: 'var(--app-text)',
                  backgroundColor: 'var(--app-hover)',
                },
                '& svg': {
                  fontSize: 18,
                },
              }}
            >
              <LogoutRounded />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <NotificationCenter
        domains={domains}
        domainFilter={domainFilter}
        notifications={notifications}
        open={notificationOpen}
        onAcknowledgeCritical={handleAcknowledgeCritical}
        onClearAll={handleClearAll}
        onClose={() => setNotificationOpen(false)}
        onDomainFilterChange={setDomainFilter}
        onClearOne={(id) => setClearedIds((current) => [...current, id])}
      />
    </Box>
  );
}

interface ActionButtonProps {
  icon: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
}

function ActionButton({ icon, ariaLabel, onClick }: ActionButtonProps) {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={onClick}
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: '10px',
        border: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-surface)',
        color: 'var(--app-text)',
        '&:hover': {
          backgroundColor: 'var(--app-hover)',
          borderColor: 'var(--app-border)',
        },
        '& svg': {
          fontSize: 16,
        },
      }}
    >
      {icon}
    </IconButton>
  );
}

interface NotificationItem {
  id: string;
  title: string;
  domain: string;
  severity: string;
  description: string;
  timestamp: string;
  persistent: boolean;
  source?: ExceptionItem;
}

function NotificationCenter({
  domains,
  domainFilter,
  notifications,
  onAcknowledgeCritical,
  onClearAll,
  onClearOne,
  onClose,
  onDomainFilterChange,
  open,
}: {
  domains: string[];
  domainFilter: string;
  notifications: NotificationItem[];
  onAcknowledgeCritical: (notification: NotificationItem) => void;
  onClearAll: () => void;
  onClearOne: (id: string) => void;
  onClose: () => void;
  onDomainFilterChange: (value: string) => void;
  open: boolean;
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 460 }, p: 2.2 }}>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Box>
              <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
                NOTIFICATION CENTER
              </Typography>
              <Typography sx={{ color: 'var(--app-text)', fontSize: 24, fontWeight: 900 }}>
                Alerts
              </Typography>
            </Box>
            <Button size="small" onClick={onClose}>
              Close
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Select
              value={domainFilter}
              onChange={(event) => onDomainFilterChange(event.target.value)}
              sx={{
                height: 36,
                minWidth: 150,
                fontSize: 13,
                fontWeight: 800,
                '& fieldset': { borderColor: 'var(--app-border)', borderRadius: '8px' },
              }}
            >
              {domains.map((domain) => (
                <MenuItem key={domain} value={domain}>
                  {domain}
                </MenuItem>
              ))}
            </Select>
            <Button variant="outlined" size="small" onClick={onClearAll}>
              Clear non-critical
            </Button>
          </Stack>

          <Stack spacing={1}>
            {notifications.length === 0 ? (
              <Box sx={{ border: '1px solid var(--app-border)', borderRadius: '8px', p: 2, textAlign: 'center' }}>
                <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 13, fontWeight: 800 }}>
                  No notifications for this filter.
                </Typography>
              </Box>
            ) : (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    border: `1px solid ${getNotificationColor(notification.severity).border}`,
                    borderLeft: `5px solid ${getNotificationColor(notification.severity).main}`,
                    borderRadius: '8px',
                    backgroundColor: notification.persistent
                      ? 'color-mix(in srgb, #d32f2f 12%, var(--app-surface))'
                      : 'var(--app-surface)',
                    p: 1.2,
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <WarningRounded sx={{ color: getNotificationColor(notification.severity).main, mt: 0.2 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap', rowGap: 0.7 }}>
                        <Typography sx={{ color: 'var(--app-text)', fontSize: 13, fontWeight: 900 }}>
                          {notification.title}
                        </Typography>
                        <Chip size="small" label={notification.domain} />
                        <Chip size="small" label={notification.severity} />
                        {notification.persistent && <Chip size="small" color="error" label="Persistent" />}
                      </Stack>
                      <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 12, mt: 0.7 }}>
                        {notification.description}
                      </Typography>
                      <Typography sx={{ color: 'var(--app-text-soft)', fontSize: 11, fontWeight: 800, mt: 0.7 }}>
                        {new Intl.DateTimeFormat('en', { dateStyle: 'short', timeStyle: 'short' }).format(
                          new Date(notification.timestamp),
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 1 }}>
                    {notification.persistent && notification.source ? (
                      <Button size="small" variant="contained" onClick={() => onAcknowledgeCritical(notification)}>
                        Acknowledge
                      </Button>
                    ) : (
                      <Button size="small" onClick={() => onClearOne(notification.id)}>
                        Clear
                      </Button>
                    )}
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

function getSeverityRank(severity: string) {
  switch (severity) {
    case 'Critical':
      return 4;
    case 'High':
      return 3;
    case 'Medium':
      return 2;
    default:
      return 1;
  }
}

function getNotificationColor(severity: string) {
  switch (severity) {
    case 'Critical':
      return { border: '#ffb5b5', main: '#d32f2f' };
    case 'High':
      return { border: '#ffd29a', main: '#d66b29' };
    case 'Medium':
      return { border: '#cadbff', main: '#4b68cf' };
    default:
      return { border: '#b9e4da', main: '#159d95' };
  }
}
