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
import { adminStyles } from './Admin.styles';

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
    <Stack spacing={3} sx={adminStyles.root}>
      <Box sx={adminStyles.headerOffset}>
        <OperationsHeader
          pageName="Administration"
          liveUpdate={false}
          title="SYSTEM CONFIGURATION"
          desc="Configure thresholds, access controls, and operational settings."
        />
      </Box>

      <Box sx={adminStyles.settingsGrid}>
        <Card
          sx={adminStyles.card}
        >
          <Box sx={adminStyles.cardHeader}>
            <NotificationsActiveIcon sx={adminStyles.cardIcon} />
            <Box>
              <Typography sx={adminStyles.cardTitle}>
                Alert thresholds
              </Typography>
              <Typography sx={adminStyles.cardDescription}>
                Configure operator notification thresholds.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                Dwell breach (minutes)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.dwellBreach}
                onChange={(e) => handleAlertChange('dwellBreach', e.target.value)}
                size="small"
                sx={adminStyles.textField}
              />
            </Box>

            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                ETA slippage (minutes)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.etaSlippage}
                onChange={(e) => handleAlertChange('etaSlippage', e.target.value)}
                size="small"
                sx={adminStyles.textField}
              />
            </Box>

            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                Stale telemetry (minutes)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.staleTelemetry}
                onChange={(e) => handleAlertChange('staleTelemetry', e.target.value)}
                size="small"
                sx={adminStyles.textField}
              />
            </Box>

            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                Reefer upper temperature (°C)
              </Typography>
              <TextField
                fullWidth
                value={alertThresholds.reeferUpperTemp}
                onChange={(e) => handleAlertChange('reeferUpperTemp', e.target.value)}
                size="small"
                sx={adminStyles.textField}
              />
            </Box>
          </Stack>
        </Card>

        <Card
          sx={adminStyles.card}
        >
          <Box sx={adminStyles.cardHeader}>
            <ShieldIcon sx={adminStyles.cardIcon} />
            <Box>
              <Typography sx={adminStyles.cardTitle}>
                Access profiles
              </Typography>
              <Typography sx={adminStyles.cardDescription}>
                Role-based feature permissions.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5}>
            {accessProfiles.map((profile) => (
              <Box
                key={profile.role}
                sx={adminStyles.profileRow}
              >
                <PersonIcon
                  sx={adminStyles.profileIcon}
                />
                <Typography sx={adminStyles.profileName}>
                  {profile.role}
                </Typography>
                <Select
                  value={accessPermissions[profile.role]}
                  onChange={(e) => handlePermissionChange(profile.role, e.target.value)}
                  size="small"
                  sx={adminStyles.smallSelect}
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
          sx={adminStyles.card}
        >
          <Box sx={adminStyles.cardHeader}>
            <SettingsIcon sx={adminStyles.cardIcon} />
            <Box>
              <Typography sx={adminStyles.cardTitle}>
                Runtime settings
              </Typography>
              <Typography sx={adminStyles.cardDescription}>
                Tenant and regional defaults.
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                Default region
              </Typography>
              <Select
                fullWidth
                value={runtimeSettings.defaultRegion}
                onChange={(e) => handleRuntimeChange('defaultRegion', e.target.value)}
                size="small"
                sx={adminStyles.fullSelect}
              >
                {regionOptions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                Distance unit
              </Typography>
              <Select
                fullWidth
                value={runtimeSettings.distanceUnit}
                onChange={(e) => handleRuntimeChange('distanceUnit', e.target.value)}
                size="small"
                sx={adminStyles.fullSelect}
              >
                {distanceUnitOptions.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography sx={adminStyles.fieldLabel}>
                Time zone
              </Typography>
              <Select
                fullWidth
                value={runtimeSettings.timeZone}
                onChange={(e) => handleRuntimeChange('timeZone', e.target.value)}
                size="small"
                sx={adminStyles.fullSelect}
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
                  sx={adminStyles.checkbox}
                />
              }
              label={
                <Typography sx={adminStyles.checkboxLabel}>
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
          sx={adminStyles.saveButton}
        >
          Save configuration
        </Button>
      </Box>

      <Box sx={adminStyles.lowerGrid}>
        <Card sx={adminStyles.compactCard}>
          <Typography sx={adminStyles.eyebrow}>
            USER & ROLE MANAGEMENT
          </Typography>
          <Stack spacing={1.2} sx={adminStyles.listStack}>
            {users.map((user) => (
              <Box
                key={user.id}
                sx={adminStyles.userRow}
              >
                <Box>
                  <Typography sx={adminStyles.userName}>
                    {user.name}
                  </Typography>
                  <Typography sx={adminStyles.mutedSmall}>{user.email}</Typography>
                </Box>
                <Select
                  value={user.role}
                  size="small"
                  onChange={(event) => updateUser({ id: user.id, role: event.target.value })}
                  sx={adminStyles.userSelect}
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
                  sx={adminStyles.userSelect}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card sx={adminStyles.compactCard}>
          <Typography sx={adminStyles.eyebrow}>
            ACTIVITY & AUDIT
          </Typography>
          <Stack spacing={1.2} sx={adminStyles.auditStack}>
            {auditEvents.map((event) => (
              <Box
                key={event.id}
                sx={adminStyles.auditRow}
              >
                <Typography sx={adminStyles.userName}>
                  {event.action} / {event.domain}
                </Typography>
                <Typography sx={adminStyles.mutedSmall}>
                  {event.actor} ({event.role}) - {event.target}
                </Typography>
                <Typography sx={adminStyles.mutedSmall}>
                  {new Intl.DateTimeFormat('en', { dateStyle: 'short', timeStyle: 'short' }).format(
                    new Date(event.timestamp),
                  )}
                </Typography>
                <Typography sx={adminStyles.auditDetails}>
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
