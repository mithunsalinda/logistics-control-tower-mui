import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useOutletContext } from 'react-router';

import BatteryAlertRounded from '@mui/icons-material/BatteryAlertRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import ThermostatRounded from '@mui/icons-material/ThermostatRounded';
import TimerRounded from '@mui/icons-material/TimerRounded';

import {
  Box,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { FilterSelect, SearchField } from '../../components';
import { REGIONS, type RegionCode } from '../../config/regions';
import { useGetFleetQuery, type Vehicle, type VehicleStatus } from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import OperationsHeader from '../dashboard/OperationsHeader';
import {
  fleetStyles,
  healthChipSx,
  metricRootSx,
  metricValueRowSx,
  metricValueSx,
  progressBarSx,
  statusChipSx,
  summaryCardSx,
  summaryValueSx,
  vehicleCardSx,
  type FleetSummaryTone,
} from './FleetAndDrivers.styles';

const statusOptions = [
  'All',
  'In Transit',
  'Delayed',
  'Loading',
  'Maintenance',
  'Offline',
  'Idle',
] as const;
const typeOptions = ['All', 'Van', 'Truck', 'Reefer', 'Tractor'] as const;
const staleTelemetryThresholdMinutes = 45;

export default function FleetAndDrivers() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const { data: vehicles = [], isFetching } = useGetFleetQuery();
  const selectedDataRegion = getDataRegion(region);
  const [searchText, setSearchText] = useState('');
  const [depotFilter, setDepotFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<(typeof typeOptions)[number]>('All');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All');

  const regionVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.region === selectedDataRegion),
    [vehicles, selectedDataRegion],
  );

  const depotOptions = useMemo(
    () => ['All', ...Array.from(new Set(regionVehicles.map((vehicle) => vehicle.depot))).sort()],
    [regionVehicles],
  );

  useEffect(() => {
    if (!depotOptions.includes(depotFilter)) {
      setDepotFilter('All');
    }
  }, [depotFilter, depotOptions]);

  const filteredVehicles = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return regionVehicles.filter((vehicle) => {
      const matchesQuery =
        query.length === 0 ||
        [vehicle.id, vehicle.type, vehicle.driver, vehicle.depot, vehicle.region]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return (
        matchesQuery &&
        (depotFilter === 'All' || vehicle.depot === depotFilter) &&
        (typeFilter === 'All' || vehicle.type === typeFilter) &&
        (statusFilter === 'All' || vehicle.status === statusFilter)
      );
    });
  }, [regionVehicles, searchText, depotFilter, typeFilter, statusFilter]);

  const summary = useMemo(
    () => ({
      total: filteredVehicles.length,
      staleCount: filteredVehicles.filter(isTelemetryStale).length,
      hosWarningCount: filteredVehicles.filter((vehicle) => vehicle.hoursRemaining <= 2).length,
      healthWarningCount: filteredVehicles.filter(hasHealthWarning).length,
    }),
    [filteredVehicles],
  );

  return (
    <Stack spacing={3} sx={fleetStyles.root}>
      <Box sx={fleetStyles.headerOffset}>
        <OperationsHeader
          pageName="Fleet Status"
          liveUpdate={false}
          title="FLEET & DRIVER MANAGEMENT"
          desc={`Live asset health, duty status, HOS risk and telemetry freshness in ${selectedDataRegion}.`}
        />
      </Box>

      <Box
        sx={fleetStyles.summaryGrid}
      >
        <FleetSummaryCard label="Visible assets" value={summary.total.toString()} tone="neutral" />
        <FleetSummaryCard label="HOS warnings" value={summary.hosWarningCount.toString()} tone="warning" />
        <FleetSummaryCard label="Health flags" value={summary.healthWarningCount.toString()} tone="critical" />
        <FleetSummaryCard label="Stale telemetry" value={summary.staleCount.toString()} tone="stale" />
      </Box>

      <Box
        sx={fleetStyles.filterBar}
      >
        <SearchField
          value={searchText}
          onChange={setSearchText}
          placeholder="Search vehicle, driver, depot..."
        />
        <FilterSelect label="Depot" value={depotFilter} options={depotOptions} onChange={setDepotFilter} />
        <FilterSelect label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} />
        <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
      </Box>

      <Box
        sx={fleetStyles.vehicleGrid}
      >
        {filteredVehicles.length === 0 ? (
          <Box
            sx={fleetStyles.emptyState}
          >
            {isFetching ? 'Loading fleet telemetry...' : 'No vehicles match the current filters.'}
          </Box>
        ) : (
          filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        )}
      </Box>
    </Stack>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const statusTone = getStatusTone(vehicle.status);
  const hosTone = getHosTone(vehicle.hoursRemaining);
  const staleTelemetry = isTelemetryStale(vehicle);
  const healthWarning = hasHealthWarning(vehicle);
  const telemetryTime = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(vehicle.telemetry));

  return (
    <Box
      sx={vehicleCardSx(staleTelemetry || healthWarning, staleTelemetry)}
    >
      <Stack direction="row" sx={fleetStyles.vehicleHeader}>
        <Stack direction="row" spacing={1.2} sx={fleetStyles.vehicleIdentity}>
          <Box
            sx={fleetStyles.iconTile}
          >
            <LocalShippingRounded sx={fleetStyles.iconSmall} />
          </Box>
          <Box sx={fleetStyles.vehicleIdentity}>
            <Typography sx={fleetStyles.vehicleTitle}>
              {vehicle.id}
            </Typography>
            <Typography sx={fleetStyles.vehicleSubtitle}>
              {vehicle.type} - {vehicle.depot}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={vehicle.status}
          sx={statusChipSx(statusTone)}
        />
      </Stack>

      <Box sx={fleetStyles.metricsGrid}>
        <Metric label="Driver" value={vehicle.driver} />
        <Metric label="Duty state" value={vehicle.dutyState} align="right" />
        <Metric icon={<SpeedRounded sx={fleetStyles.metricIcon} />} label="Speed" value={`${vehicle.speed} km/h`} />
        <Metric label="Region" value={getRegionLabel(vehicle.region)} align="right" />
        <Metric
          icon={<TimerRounded sx={fleetStyles.metricIcon} />}
          label="HOS remaining"
          value={`${vehicle.hoursRemaining}h`}
          tone={hosTone}
        />
        <Metric
          label="Telemetry"
          value={staleTelemetry ? `${telemetryTime} stale` : telemetryTime}
          tone={staleTelemetry ? 'warning' : 'normal'}
          align="right"
        />
      </Box>

      <Stack direction="row" spacing={0.8} sx={fleetStyles.healthChips}>
        {vehicle.hoursRemaining <= 2 && <HealthChip severity="warning" label="HOS limit approaching" />}
        {staleTelemetry && <HealthChip severity="warning" label="Stale telemetry" />}
        {vehicle.fuelLevel <= 25 && <HealthChip severity="critical" label="Low fuel" />}
        {vehicle.chargeLevel !== null && vehicle.chargeLevel <= 25 && (
          <HealthChip severity="critical" label="Low charge" />
        )}
        {vehicle.engineFaults.length > 0 && (
          <HealthChip severity="critical" label={`${vehicle.engineFaults.length} engine fault`} />
        )}
        {vehicle.temperature !== null && (vehicle.temperature < 2 || vehicle.temperature > 8) && (
          <HealthChip severity="critical" label="Reefer temp out of range" />
        )}
      </Stack>

      <Box sx={fleetStyles.signalSection}>
        <SignalBar label="Utilization" value={vehicle.utilization} />
        <SignalBar label="Fuel" value={vehicle.fuelLevel} color={vehicle.fuelLevel <= 25 ? '#ef4444' : '#3eb7a9'} />
        {vehicle.chargeLevel !== null && (
          <SignalBar
            label="Charge"
            value={vehicle.chargeLevel}
            color={vehicle.chargeLevel <= 25 ? '#ef4444' : '#3eb7a9'}
          />
        )}
        {vehicle.temperature !== null && (
          <Stack direction="row" spacing={0.8} sx={fleetStyles.inlineSignal}>
            <ThermostatRounded sx={fleetStyles.inlineSignalIcon} />
            <Typography sx={fleetStyles.inlineText}>
              Reefer temperature: {vehicle.temperature} C
            </Typography>
          </Stack>
        )}
        {vehicle.engineFaults.length > 0 && (
          <Stack direction="row" spacing={0.8} sx={fleetStyles.inlineFault}>
            <ErrorOutlineRounded sx={fleetStyles.faultIcon} />
            <Typography sx={fleetStyles.faultText}>
              {vehicle.engineFaults.join(', ')}
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

function Metric({
  align = 'left',
  icon,
  label,
  tone = 'normal',
  value,
}: {
  align?: 'left' | 'right';
  icon?: ReactNode;
  label: string;
  tone?: 'normal' | 'warning' | 'critical';
  value: string;
}) {
  return (
    <Box sx={metricRootSx(align)}>
      <Typography sx={fleetStyles.metricLabel}>
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={0.5}
        sx={metricValueRowSx(align)}
      >
        {icon}
        <Typography sx={metricValueSx(tone)}>{value}</Typography>
      </Stack>
    </Box>
  );
}

function SignalBar({ color = '#3eb7a9', label, value }: { color?: string; label: string; value: number }) {
  return (
    <Box sx={fleetStyles.signalRoot}>
      <Stack direction="row" sx={fleetStyles.signalHeader}>
        <Typography sx={fleetStyles.signalLabel}>{label}</Typography>
        <Typography sx={fleetStyles.signalValue}>{value}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={progressBarSx(color)}
      />
    </Box>
  );
}

function HealthChip({ label, severity }: { label: string; severity: 'warning' | 'critical' }) {
  const isCritical = severity === 'critical';

  return (
    <Chip
      icon={isCritical ? <BatteryAlertRounded /> : <TimerRounded />}
      label={label}
      size="small"
      sx={healthChipSx(isCritical)}
    />
  );
}

function FleetSummaryCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: FleetSummaryTone;
  value: string;
}) {
  return (
    <Box
      sx={summaryCardSx(tone)}
    >
      <Typography sx={fleetStyles.summaryLabel}>{label}</Typography>
      <Typography sx={summaryValueSx(tone)}>{value}</Typography>
    </Box>
  );
}

function getStatusTone(status: VehicleStatus) {
  switch (status) {
    case 'Delayed':
      return { bg: '#fff0dc', text: '#a15c08', border: '#f5c17a' };
    case 'Loading':
      return { bg: '#e9ebff', text: '#5162d5', border: '#c5ccff' };
    case 'Maintenance':
      return { bg: '#fee2e2', text: '#b42318', border: '#fecaca' };
    case 'Offline':
      return { bg: '#e5e7eb', text: '#4b5563', border: '#cbd5e1' };
    case 'Idle':
      return { bg: '#f1f5f9', text: '#475569', border: '#d5e0eb' };
    default:
      return { bg: '#dff6ef', text: '#0f8d81', border: '#9ddcc7' };
  }
}

function getHosTone(hoursRemaining: number): 'normal' | 'warning' | 'critical' {
  if (hoursRemaining <= 1.5) {
    return 'critical';
  }

  if (hoursRemaining <= 3) {
    return 'warning';
  }

  return 'normal';
}

function isTelemetryStale(vehicle: Vehicle) {
  const telemetryTime = new Date(vehicle.telemetry).getTime();
  const currentBusinessTime = new Date('2026-08-19T14:17:00+05:30').getTime();
  const minutesSinceTelemetry = (currentBusinessTime - telemetryTime) / 60000;

  return vehicle.status === 'Offline' || minutesSinceTelemetry > staleTelemetryThresholdMinutes;
}

function hasHealthWarning(vehicle: Vehicle) {
  const hasFuelWarning = vehicle.fuelLevel <= 25;
  const hasChargeWarning = vehicle.chargeLevel !== null && vehicle.chargeLevel <= 25;
  const hasReeferWarning =
    vehicle.temperature !== null && (vehicle.temperature < 2 || vehicle.temperature > 8);

  return hasFuelWarning || hasChargeWarning || hasReeferWarning || vehicle.engineFaults.length > 0;
}

function getRegionLabel(region: string) {
  const regionEntry = Object.entries(REGIONS).find(([, config]) => config.name === region);
  const regionCode = regionEntry?.[0] as RegionCode | undefined;

  return regionCode ? REGIONS[regionCode].name : region;
}
