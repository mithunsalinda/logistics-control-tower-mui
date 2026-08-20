import { useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  NotificationsActive as NotificationsActiveIcon,
  Shield as ShieldIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import OperationsHeader from '../dashboard/OperationsHeader';
import { useGetAuditEventsQuery, useGetUsersQuery, useUpdateUserMutation } from '../../store';

interface AlertThresholds {
  dwellBreach: number;
  etaSlippage: number;
  staleTelemetry: number;
  reeferUpperTemp: number;
}

interface AccessProfile {
  role: string;
  permission: string;
  icon?: string;
}

interface RuntimeSettings {
  defaultRegion: string;
  distanceUnit: string;
  timeZone: string;
  enableCapacityModule: boolean;
}

const accessProfiles: AccessProfile[] = [
  { role: 'Dispatcher', permission: 'Full' },
  { role: 'Operations Manager', permission: 'Full' },
  { role: 'Planner', permission: 'Full' },
  { role: 'Warehouse Coordinator', permission: 'Full' },
  { role: 'Administrator', permission: 'Full' },
  { role: 'Read-only Viewer', permission: 'Read' },
];

const permissionOptions = ['Full', 'Read', 'Write', 'Execute'];
const regionOptions = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa'];
const roleOptions = [
  'Dispatcher',
  'Operations Manager',
  'Planner',
  'Warehouse Coordinator',
  'Administrator',
  'Read-only Viewer',
];
const distanceUnitOptions = ['Kilometres', 'Miles', 'Nautical Miles'];
const timeZoneOptions = [
  'Operator local',
  'UTC',
  'EST',
  'CST',
  'MST',
  'PST',
  'GMT',
  'CET',
  'IST',
  'JST',
];

export default function Admin() {
  const { data: users = [] } = useGetUsersQuery();
  const { data: auditEvents = [] } = useGetAuditEventsQuery();
  const [updateUser] = useUpdateUserMutation();
  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>({
    dwellBreach: 60,
    etaSlippage: 30,
    staleTelemetry: 5,
    reeferUpperTemp: 8,
  });

  const [runtimeSettings, setRuntimeSettings] = useState<RuntimeSettings>({
    defaultRegion: 'North America',
    distanceUnit: 'Kilometres',
    timeZone: 'Operator local',
    enableCapacityModule: true,
  });

  const [accessPermissions, setAccessPermissions] = useState<Record<string, string>>({
    Dispatcher: 'Full',
    'Operations Manager': 'Full',
    Planner: 'Full',
    'Warehouse Coordinator': 'Full',
    Administrator: 'Full',
    'Read-only Viewer': 'Read',
  });

  const handleAlertChange = (key: keyof AlertThresholds, value: string | number) => {
    setAlertThresholds((prev) => ({
      ...prev,
      [key]: typeof value === 'string' ? parseFloat(value) : value,
    }));
  };

  const handlePermissionChange = (role: string, permission: string) => {
    setAccessPermissions((prev) => ({
      ...prev,
      [role]: permission,
    }));
  };

  const handleRuntimeChange = (key: keyof RuntimeSettings, value: string | boolean) => {
    setRuntimeSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log('Configuration saved:', {
      alertThresholds,
      accessPermissions,
      runtimeSettings,
    });
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Administration"
          liveUpdate={false}
          title="SYSTEM CONFIGURATION"
          desc="Configure thresholds, access controls, and operational settings."
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        <Card
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: '1px solid #e8eef5',
            backgroundColor: '#ffffff',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <NotificationsActiveIcon sx={{ color: '#2e8b8a', fontSize: 24 }} />
            <Box>
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                Alert thresholds
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#7a8a9e',
                  fontWeight: 500,
                }}
              >
                Configure operator notification thresholds.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                Dwell breach (minutes)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.dwellBreach}
                onChange={(e) => handleAlertChange('dwellBreach', e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                ETA slippage (minutes)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.etaSlippage}
                onChange={(e) => handleAlertChange('etaSlippage', e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                Stale telemetry (minutes)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.staleTelemetry}
                onChange={(e) => handleAlertChange('staleTelemetry', e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                Reefer upper temperature (°C)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.reeferUpperTemp}
                onChange={(e) => handleAlertChange('reeferUpperTemp', e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Box>
          </Stack>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: '1px solid #e8eef5',
            backgroundColor: '#ffffff',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShieldIcon sx={{ color: '#2e8b8a', fontSize: 24 }} />
            <Box>
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                Access profiles
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#7a8a9e',
                  fontWeight: 500,
                }}
              >
                Role-based feature permissions.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5}>
            {accessProfiles.map((profile) => (
              <Box
                key={profile.role}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  pb: 1.5,
                  borderBottom: '1px solid #e8eef5',
                  '&:last-child': {
                    borderBottom: 'none',
                    pb: 0,
                  },
                }}
              >
                <PersonIcon
                  sx={{
                    color: '#2e8b8a',
                    fontSize: 20,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1d2d3f',
                    flex: 1,
                  }}
                >
                  {profile.role}
                </Typography>
                <Select
                  value={accessPermissions[profile.role]}
                  onChange={(e) => handlePermissionChange(profile.role, e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 100,
                    backgroundColor: '#f5f8fb',
                    borderRadius: '6px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d4e0eb',
                    },
                  }}
                >
                  {permissionOptions.map((perm) => (
                    <MenuItem key={perm} value={perm}>
                      {perm}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: '1px solid #e8eef5',
            backgroundColor: '#ffffff',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SettingsIcon sx={{ color: '#2e8b8a', fontSize: 24 }} />
            <Box>
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                Runtime settings
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#7a8a9e',
                  fontWeight: 500,
                }}
              >
                Tenant and regional defaults.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                Default region
              </Typography>
              <Select
                fullWidth
                value={runtimeSettings.defaultRegion}
                onChange={(e) => handleRuntimeChange('defaultRegion', e.target.value)}
                size="small"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                }}
              >
                {regionOptions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                Distance unit
              </Typography>
              <Select
                fullWidth
                value={runtimeSettings.distanceUnit}
                onChange={(e) => handleRuntimeChange('distanceUnit', e.target.value)}
                size="small"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                }}
              >
                {distanceUnitOptions.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#647b99',
                  fontWeight: 500,
                  mb: 0.75,
                }}
              >
                Time zone
              </Typography>
              <Select
                fullWidth
                value={runtimeSettings.timeZone}
                onChange={(e) => handleRuntimeChange('timeZone', e.target.value)}
                size="small"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                }}
              >
                {timeZoneOptions.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={runtimeSettings.enableCapacityModule}
                  onChange={(e) => handleRuntimeChange('enableCapacityModule', e.target.checked)}
                  sx={{
                    color: '#2e8b8a',
                    '&.Mui-checked': {
                      color: '#2e8b8a',
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: '#647b99',
                    fontWeight: 500,
                  }}
                >
                  Enable capacity module
                </Typography>
              }
            />
          </Stack>
        </Card>
      </Box>

      <Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            backgroundColor: '#2e8b8a',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '14px',
            py: 1.5,
            px: 3,
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1a5453',
            },
          }}
        >
          Save configuration
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: 2,
        }}
      >
        <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e8eef5' }}>
          <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
            USER & ROLE MANAGEMENT
          </Typography>
          <Stack spacing={1.2} sx={{ mt: 1.5 }}>
            {users.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 190px 110px' },
                  gap: 1,
                  alignItems: 'center',
                  border: '1px solid #edf1f6',
                  borderRadius: '8px',
                  p: 1,
                }}
              >
                <Box>
                  <Typography sx={{ color: '#10243a', fontSize: 13, fontWeight: 900 }}>
                    {user.name}
                  </Typography>
                  <Typography sx={{ color: '#64758a', fontSize: 11 }}>{user.email}</Typography>
                </Box>
                <Select
                  value={user.role}
                  size="small"
                  onChange={(event) => updateUser({ id: user.id, role: event.target.value })}
                  sx={{
                    backgroundColor: '#ffffff',
                    '& fieldset': { borderColor: '#d4e0eb', borderRadius: '8px' },
                  }}
                >
                  {roleOptions.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={user.status}
                  size="small"
                  onChange={(event) => updateUser({ id: user.id, status: event.target.value as 'Active' | 'Suspended' })}
                  sx={{
                    backgroundColor: '#ffffff',
                    '& fieldset': { borderColor: '#d4e0eb', borderRadius: '8px' },
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e8eef5' }}>
          <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
            ACTIVITY & AUDIT
          </Typography>
          <Stack spacing={1.2} sx={{ mt: 1.5, maxHeight: 360, overflow: 'auto' }}>
            {auditEvents.map((event) => (
              <Box
                key={event.id}
                sx={{ borderLeft: '4px solid #159d95', backgroundColor: '#f8fbfd', borderRadius: '8px', p: 1 }}
              >
                <Typography sx={{ color: '#10243a', fontSize: 13, fontWeight: 900 }}>
                  {event.action} / {event.domain}
                </Typography>
                <Typography sx={{ color: '#64758a', fontSize: 11 }}>
                  {event.actor} ({event.role}) - {event.target}
                </Typography>
                <Typography sx={{ color: '#64758a', fontSize: 11 }}>
                  {new Intl.DateTimeFormat('en', { dateStyle: 'short', timeStyle: 'short' }).format(
                    new Date(event.timestamp),
                  )}
                </Typography>
                <Typography sx={{ color: '#52677f', fontSize: 12, mt: 0.6 }}>
                  {event.details}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
}
