import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';

import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SwapCallsRoundedIcon from '@mui/icons-material/SwapCallsRounded';

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import type { RegionCode } from '../../config/regions';
import {
  useGetRoutePlansQuery,
  type RiskLevel,
  type RouteConflict,
  type RouteLeg,
  type RouteOption,
  type RoutePlan,
  type RouteStop,
} from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import { ConfirmDialog } from '../../components';
import OperationsHeader from '../dashboard/OperationsHeader';

const statusOptions = ['All', 'Healthy', 'Disrupted', 'Conflict'] as const;

export default function RoutePlanning() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const selectedDataRegion = getDataRegion(region);
  const { data: routePlans = [], isFetching } = useGetRoutePlansQuery();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [confirmedOptionId, setConfirmedOptionId] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<RouteOption | null>(null);

  const filteredPlans = useMemo(
    () =>
      routePlans.filter((plan) => {
        const query = searchText.trim().toLowerCase();
        const searchable = [
          plan.shipmentId,
          plan.vehicleId,
          plan.carrier,
          plan.origin,
          plan.destination,
          plan.disruption,
        ]
          .join(' ')
          .toLowerCase();

        return (
          plan.region === selectedDataRegion &&
          (statusFilter === 'All' || plan.status === statusFilter) &&
          (query.length === 0 || searchable.includes(query))
        );
      }),
    [routePlans, searchText, selectedDataRegion, statusFilter],
  );

  useEffect(() => {
    setSelectedPlanId(filteredPlans[0]?.id ?? '');
  }, [filteredPlans]);

  const selectedPlan = filteredPlans.find((plan) => plan.id === selectedPlanId) ?? filteredPlans[0];
  const candidateRoutes = selectedPlan?.candidateRoutes ?? [];
  const comparisonRoutes = candidateRoutes.filter((option) => compareIds.includes(option.id));
  const planOptions = selectedPlan ? [selectedPlan.plannedRoute, ...candidateRoutes] : [];

  useEffect(() => {
    if (selectedPlan) {
      setCompareIds(selectedPlan.candidateRoutes.slice(0, 2).map((option) => option.id));
      setConfirmedOptionId('');
    }
  }, [selectedPlan?.id]);

  const handleCompareToggle = (optionId: string) => {
    setCompareIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId].slice(-3),
    );
  };

  const handleConfirm = (option: RouteOption) => {
    setPendingConfirmation(option);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <OperationsHeader
        pageName="Route Planning"
        liveUpdate={false}
        title="ROUTE PLANNING & OPTIMIZATION"
        desc={`Inspect route legs, compare backend reroute options and resolve route conflicts in ${selectedDataRegion}.`}
      />

      <SummaryStrip plans={filteredPlans} loading={isFetching} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '360px minmax(0, 1fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Stack spacing={1.5}>
          <FilterBar
            searchText={searchText}
            statusFilter={statusFilter}
            onSearchChange={setSearchText}
            onStatusChange={setStatusFilter}
          />
          <RoutePlanList
            plans={filteredPlans}
            selectedPlanId={selectedPlan?.id ?? ''}
            onSelect={setSelectedPlanId}
          />
        </Stack>

        {selectedPlan ? (
          <Stack spacing={2}>
            <SelectedPlanHeader plan={selectedPlan} confirmedOptionId={confirmedOptionId} />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.1fr) minmax(340px, 0.9fr)' },
                gap: 2,
              }}
            >
              <RouteInspector route={selectedPlan.plannedRoute} title="Planned Route" />

              <Stack spacing={2}>
                <ConflictPanel conflicts={selectedPlan.conflicts} />
                <CandidatePanel
                  compareIds={compareIds}
                  confirmedOptionId={confirmedOptionId}
                  options={candidateRoutes}
                  onCompareToggle={handleCompareToggle}
                  onConfirm={handleConfirm}
                />
              </Stack>
            </Box>

            <ComparePanel routes={comparisonRoutes} />
          </Stack>
        ) : (
          <EmptyState />
        )}

        <Box sx={{ display: 'none' }}>
          {planOptions.map((option) => option.id).join(',')}
        </Box>
      </Box>
      <ConfirmDialog
        open={Boolean(pendingConfirmation)}
        title="Confirm Reroute"
        description={
          pendingConfirmation
            ? `Apply "${pendingConfirmation.label}" for the selected shipment? This records the operator decision and marks the option as confirmed.`
            : ''
        }
        confirmLabel="Confirm route"
        tone="warning"
        onCancel={() => setPendingConfirmation(null)}
        onConfirm={() => {
          if (pendingConfirmation) {
            setConfirmedOptionId(pendingConfirmation.id);
          }
          setPendingConfirmation(null);
        }}
      />
    </Stack>
  );
}

function SummaryStrip({ loading, plans }: { loading: boolean; plans: RoutePlan[] }) {
  const disrupted = plans.filter((plan) => plan.status === 'Disrupted').length;
  const conflicts = plans.reduce((total, plan) => total + plan.conflicts.length, 0);
  const recommended = plans.filter((plan) => plan.candidateRoutes.some((route) => route.recommended)).length;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        gap: 1.5,
      }}
    >
      <MetricCard label="Route plans" value={loading ? '...' : String(plans.length)} tone="blue" />
      <MetricCard label="Disrupted routes" value={String(disrupted)} tone="amber" />
      <MetricCard label="Open conflicts" value={String(conflicts)} tone="red" />
      <MetricCard label="Recommended options" value={String(recommended)} tone="green" />
    </Box>
  );
}

function MetricCard({ label, tone, value }: { label: string; tone: 'amber' | 'blue' | 'green' | 'red'; value: string }) {
  const color = toneColors[tone];

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.main}`,
        borderRadius: '8px',
        backgroundColor: color.bg,
        p: 1.8,
      }}
    >
      <Typography sx={{ color: '#5d7088', fontSize: 12, fontWeight: 900 }}>{label}</Typography>
      <Typography sx={{ color: color.text, fontSize: 28, fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

function FilterBar({
  onSearchChange,
  onStatusChange,
  searchText,
  statusFilter,
}: {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: (typeof statusOptions)[number]) => void;
  searchText: string;
  statusFilter: (typeof statusOptions)[number];
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 150px',
        gap: 1,
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#f7fafc',
        p: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          height: 38,
          border: '1px solid #d5e0eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          px: 1.2,
          gap: 1,
        }}
      >
        <SearchRoundedIcon sx={{ color: '#334a63', fontSize: 18 }} />
        <Box
          component="input"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search shipment, vehicle, lane..."
          sx={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#1d2b3b',
            fontSize: 13,
          }}
        />
      </Box>
      <Select
        value={statusFilter}
        onChange={(event: SelectChangeEvent) =>
          onStatusChange(event.target.value as (typeof statusOptions)[number])
        }
        sx={{
          height: 38,
          backgroundColor: '#ffffff',
          color: '#1b2b40',
          fontSize: 13,
          fontWeight: 800,
          '& fieldset': { borderColor: '#d5e0eb', borderRadius: '8px' },
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

function RoutePlanList({
  onSelect,
  plans,
  selectedPlanId,
}: {
  onSelect: (value: string) => void;
  plans: RoutePlan[];
  selectedPlanId: string;
}) {
  return (
    <Stack spacing={1}>
      {plans.map((plan) => (
        <Box
          key={plan.id}
          component="button"
          onClick={() => onSelect(plan.id)}
          sx={{
            width: '100%',
            textAlign: 'left',
            border: `1px solid ${plan.id === selectedPlanId ? '#159d95' : '#d9e3ed'}`,
            borderLeft: `4px solid ${getStatusColor(plan.status).main}`,
            borderRadius: '8px',
            backgroundColor: plan.id === selectedPlanId ? '#eefbf9' : '#ffffff',
            p: 1.4,
            cursor: 'pointer',
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, mb: 0.8 }}>
            <Box>
              <Typography sx={{ color: '#12263c', fontSize: 15, fontWeight: 900 }}>
                {plan.shipmentId}
              </Typography>
              <Typography sx={{ color: '#63758c', fontSize: 11, fontWeight: 700 }}>
                {plan.origin} to {plan.destination}
              </Typography>
            </Box>
            <Chip label={plan.status} sx={smallChipSx(getStatusColor(plan.status))} />
          </Stack>
          <Typography sx={{ color: '#4f657f', fontSize: 12, lineHeight: 1.45 }}>
            {plan.disruption}
          </Typography>
          <Stack direction="row" spacing={0.6} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.6 }}>
            <Chip size="small" icon={<LocalShippingRoundedIcon />} label={plan.vehicleId} />
            <Chip size="small" label={`${plan.candidateRoutes.length} options`} />
            {plan.conflicts.length > 0 && <Chip size="small" color="warning" label={`${plan.conflicts.length} conflict`} />}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

function SelectedPlanHeader({
  confirmedOptionId,
  plan,
}: {
  confirmedOptionId: string;
  plan: RoutePlan;
}) {
  const confirmedRoute = plan.candidateRoutes.find((route) => route.id === confirmedOptionId);

  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 1.8,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.2}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
      >
        <Box>
          <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.8 }}>
            SELECTED SHIPMENT
          </Typography>
          <Typography sx={{ color: '#10243a', fontSize: 24, fontWeight: 900 }}>
            {plan.shipmentId} - {plan.origin} to {plan.destination}
          </Typography>
          <Typography sx={{ color: '#5d7088', fontSize: 13 }}>
            {plan.carrier} / {plan.vehicleId}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Chip label={plan.status} sx={smallChipSx(getStatusColor(plan.status))} />
          <Chip label={`${plan.candidateRoutes.length} reroute options`} />
          {confirmedRoute && <Chip color="success" label={`Confirmed: ${confirmedRoute.label}`} />}
        </Stack>
      </Stack>
    </Box>
  );
}

function RouteInspector({ route, title }: { route: RouteOption; title: string }) {
  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 1.8,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box>
          <Typography sx={sectionEyebrowSx}>{title}</Typography>
          <Typography sx={{ color: '#10243a', fontSize: 20, fontWeight: 900 }}>{route.label}</Typography>
        </Box>
        <RouteScore route={route} />
      </Stack>

      <RouteSchematic route={route} />

      <Divider sx={{ my: 1.6 }} />

      <RouteTimeline stops={route.stops} />

      <Divider sx={{ my: 1.6 }} />

      <Stack spacing={1}>
        {route.legs.map((leg) => (
          <LegRow key={leg.id} leg={leg} />
        ))}
      </Stack>
    </Box>
  );
}

function RouteSchematic({ route }: { route: RouteOption }) {
  return (
    <Box
      sx={{
        border: '1px solid #dfe8f0',
        borderRadius: '8px',
        backgroundColor: '#f8fbfd',
        p: 1.3,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(route.stops.length, 1)}, minmax(92px, 1fr))`,
          gap: 1,
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '7%',
            right: '7%',
            top: 23,
            borderTop: `4px ${route.type === 'Planned' ? 'solid' : 'dashed'} #159d95`,
            opacity: 0.55,
          },
        }}
      >
        {route.stops.map((stop, index) => (
          <Box key={stop.id} sx={{ position: 'relative', zIndex: 1, textAlign: 'center', minWidth: 0 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                mx: 'auto',
                borderRadius: '50%',
                backgroundColor: getStopColor(stop.status).main,
                border: '4px solid #ffffff',
                boxShadow: '0 8px 18px rgba(24, 49, 73, 0.16)',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {index + 1}
            </Box>
            <Typography
              sx={{
                color: '#10243a',
                fontSize: 12,
                fontWeight: 900,
                mt: 0.8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={stop.name}
            >
              {stop.city}
            </Typography>
            <Typography sx={{ color: '#64758a', fontSize: 10, fontWeight: 800 }}>
              {stop.type}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function RouteTimeline({ stops }: { stops: RouteStop[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.max(stops.length, 1)}, 1fr)` },
        gap: 1,
      }}
    >
      {stops.map((stop, index) => (
        <Box
          key={stop.id}
          sx={{
            position: 'relative',
            border: `1px solid ${getStopColor(stop.status).border}`,
            borderRadius: '8px',
            backgroundColor: getStopColor(stop.status).bg,
            p: 1.2,
            minHeight: 138,
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: getStopColor(stop.status).main,
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 13,
                fontWeight: 900,
                flex: '0 0 auto',
              }}
            >
              {index + 1}
            </Box>
            <Chip size="small" label={stop.status} sx={smallChipSx(getStopColor(stop.status))} />
          </Stack>
          <Typography sx={{ color: '#10243a', fontSize: 14, fontWeight: 900, mt: 1 }}>
            {stop.name}
          </Typography>
          <Typography sx={{ color: '#64758a', fontSize: 11, fontWeight: 700 }}>
            {stop.type} / {stop.city} / {stop.facilityCode}
          </Typography>
          <Typography sx={{ color: '#64758a', fontSize: 11, mt: 1 }}>
            Planned {formatDateTime(stop.plannedArrival)}
          </Typography>
          <Typography sx={{ color: '#10243a', fontSize: 12, fontWeight: 900 }}>
            ETA {formatDateTime(stop.estimatedArrival)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function LegRow({ leg }: { leg: RouteLeg }) {
  const delay = leg.estimatedMinutes - leg.plannedMinutes;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 92px 95px 95px' },
        gap: 1,
        alignItems: 'center',
        border: '1px solid #e0e8f0',
        borderRadius: '8px',
        p: 1.1,
        backgroundColor: '#f8fbfd',
      }}
    >
      <Box>
        <Typography sx={{ color: '#10243a', fontSize: 13, fontWeight: 900 }}>
          {leg.from} to {leg.to}
        </Typography>
        <Typography sx={{ color: '#64758a', fontSize: 11 }}>
          {leg.mode} / {leg.distanceKm.toLocaleString()} km
        </Typography>
      </Box>
      <Chip label={leg.status} sx={smallChipSx(getLegColor(leg.status))} />
      <Typography sx={{ color: '#334a63', fontSize: 12, fontWeight: 800 }}>
        {formatDuration(leg.estimatedMinutes)}
      </Typography>
      <Typography sx={{ color: delay > 0 ? '#b45309' : '#237b63', fontSize: 12, fontWeight: 900 }}>
        {delay > 0 ? '+' : ''}
        {delay} min
      </Typography>
    </Box>
  );
}

function CandidatePanel({
  compareIds,
  confirmedOptionId,
  onCompareToggle,
  onConfirm,
  options,
}: {
  compareIds: string[];
  confirmedOptionId: string;
  onCompareToggle: (value: string) => void;
  onConfirm: (value: RouteOption) => void;
  options: RouteOption[];
}) {
  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 1.8,
      }}
    >
      <Typography sx={sectionEyebrowSx}>REROUTE OPTIONS</Typography>
      <Stack spacing={1.1} sx={{ mt: 1 }}>
        {options.map((option) => (
          <Box
            key={option.id}
            sx={{
              border: `1px solid ${option.recommended ? '#72c7b7' : '#dce5ee'}`,
              borderRadius: '8px',
              backgroundColor: option.recommended ? '#f1fbf8' : '#ffffff',
              p: 1.2,
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Box>
                <Typography sx={{ color: '#10243a', fontSize: 14, fontWeight: 900 }}>
                  {option.label}
                </Typography>
                <Stack direction="row" spacing={0.7} sx={{ mt: 0.8, flexWrap: 'wrap', rowGap: 0.7 }}>
                  {option.recommended && <Chip size="small" color="success" label="Recommended" />}
                  <Chip size="small" label={`ETA ${formatImpact(option.etaImpactMinutes)}`} />
                  <Chip size="small" label={`Cost ${formatCurrency(option.costImpactUsd)}`} />
                  <Chip size="small" label={`Risk ${option.risk}`} />
                </Stack>
              </Box>
              <Checkbox
                checked={compareIds.includes(option.id)}
                onChange={() => onCompareToggle(option.id)}
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={option.confidence}
              sx={{
                height: 6,
                borderRadius: 999,
                mt: 1.2,
                backgroundColor: '#e3ebf2',
                '& .MuiLinearProgress-bar': { backgroundColor: '#159d95' },
              }}
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ color: '#63758c', fontSize: 11, fontWeight: 800 }}>
                Confidence {option.confidence}%
              </Typography>
              <Button
                size="small"
                variant={confirmedOptionId === option.id ? 'contained' : 'outlined'}
                color={confirmedOptionId === option.id ? 'success' : 'primary'}
                onClick={() => onConfirm(option)}
              >
                {confirmedOptionId === option.id ? 'Confirmed' : 'Confirm'}
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function ConflictPanel({ conflicts }: { conflicts: RouteConflict[] }) {
  return (
    <Box
      sx={{
        border: `1px solid ${conflicts.length > 0 ? '#ffb55a' : '#d9e3ed'}`,
        borderRadius: '10px',
        backgroundColor: conflicts.length > 0 ? '#fff8ed' : '#ffffff',
        p: 1.8,
      }}
    >
      <Typography sx={sectionEyebrowSx}>ROUTE CONFLICTS</Typography>
      {conflicts.length === 0 ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
          <CheckCircleRoundedIcon sx={{ color: '#2f8f6b' }} />
          <Typography sx={{ color: '#335069', fontSize: 13, fontWeight: 800 }}>
            No overlapping vehicle windows detected.
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={1} sx={{ mt: 1 }}>
          {conflicts.map((conflict) => (
            <Box key={conflict.id} sx={{ border: '1px solid #ffd08f', borderRadius: '8px', p: 1.1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <ErrorRoundedIcon sx={{ color: '#d66b29', fontSize: 20 }} />
                <Typography sx={{ color: '#10243a', fontSize: 13, fontWeight: 900 }}>
                  {conflict.vehicleId} / {conflict.severity}
                </Typography>
              </Stack>
              <Typography sx={{ color: '#5e7187', fontSize: 12, mt: 0.7 }}>{conflict.reason}</Typography>
              <Typography sx={{ color: '#9a5a15', fontSize: 11, fontWeight: 800, mt: 0.7 }}>
                {formatDateTime(conflict.windowStart)} to {formatDateTime(conflict.windowEnd)}
              </Typography>
              <Chip size="small" sx={{ mt: 0.8 }} label={conflict.shipmentIds.join(' + ')} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function ComparePanel({ routes }: { routes: RouteOption[] }) {
  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 1.8,
      }}
    >
      <Typography sx={sectionEyebrowSx}>SIDE BY SIDE ROUTE COMPARISON</Typography>
      {routes.length === 0 ? (
        <Typography sx={{ color: '#63758c', fontSize: 13, mt: 1 }}>
          Select reroute options to compare.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: `repeat(${routes.length}, minmax(240px, 1fr))` },
            gap: 1.2,
            mt: 1,
          }}
        >
          {routes.map((route) => (
            <Box key={route.id} sx={{ border: '1px solid #e0e8f0', borderRadius: '8px', p: 1.2 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#10243a', fontSize: 14, fontWeight: 900 }}>
                  {route.label}
                </Typography>
                <Chip label={route.risk} sx={smallChipSx(getRiskColor(route.risk))} />
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8, my: 1.2 }}>
                <MiniMetric icon={<ScheduleRoundedIcon />} label="ETA" value={formatImpact(route.etaImpactMinutes)} />
                <MiniMetric icon={<SwapCallsRoundedIcon />} label="Cost" value={formatCurrency(route.costImpactUsd)} />
                <MiniMetric icon={<FlagRoundedIcon />} label="Stops" value={String(route.stops.length)} />
              </Box>
              <Stack spacing={0.8}>
                <Typography sx={{ color: '#159d95', fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>
                  STOPS
                </Typography>
                {route.stops.map((stop) => (
                  <Box key={stop.id} sx={{ borderLeft: `4px solid ${getStopColor(stop.status).main}`, pl: 1 }}>
                    <Typography sx={{ color: '#10243a', fontSize: 12, fontWeight: 900 }}>
                      {stop.name}
                    </Typography>
                    <Typography sx={{ color: '#64758a', fontSize: 11 }}>
                      ETA {formatDateTime(stop.estimatedArrival)}
                    </Typography>
                  </Box>
                ))}
                <Divider />
                <Typography sx={{ color: '#159d95', fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>
                  LEGS
                </Typography>
                {route.legs.map((leg) => (
                  <Box key={leg.id} sx={{ borderLeft: `4px solid ${getLegColor(leg.status).main}`, pl: 1 }}>
                    <Typography sx={{ color: '#10243a', fontSize: 12, fontWeight: 900 }}>
                      {leg.from} to {leg.to}
                    </Typography>
                    <Typography sx={{ color: '#64758a', fontSize: 11 }}>
                      {leg.mode} / {formatDuration(leg.estimatedMinutes)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid #e1eaf2', borderRadius: '8px', p: 0.8, minWidth: 0 }}>
      <Stack direction="row" spacing={0.5} sx={{ color: '#64758a', alignItems: 'center' }}>
        {icon}
        <Typography sx={{ color: '#64758a', fontSize: 10, fontWeight: 900 }}>{label}</Typography>
      </Stack>
      <Typography sx={{ color: '#10243a', fontSize: 12, fontWeight: 900, mt: 0.4 }}>{value}</Typography>
    </Box>
  );
}

function RouteScore({ route }: { route: RouteOption }) {
  return (
    <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end', rowGap: 0.7 }}>
      <Chip icon={<AltRouteRoundedIcon />} label={`${route.confidence}% confidence`} />
      <Chip icon={<ScheduleRoundedIcon />} label={`ETA ${formatImpact(route.etaImpactMinutes)}`} />
      <Chip icon={<RouteRoundedIcon />} label={formatCurrency(route.costImpactUsd)} />
    </Stack>
  );
}

function EmptyState() {
  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ color: '#10243a', fontSize: 20, fontWeight: 900 }}>No route plans found</Typography>
      <Typography sx={{ color: '#63758c', fontSize: 13, mt: 0.5 }}>
        Adjust the status or search criteria for the selected region.
      </Typography>
    </Box>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function formatImpact(minutes: number) {
  return `${minutes > 0 ? '+' : ''}${minutes} min`;
}

function formatCurrency(value: number) {
  const sign = value > 0 ? '+' : '';

  return `${sign}${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function getStatusColor(status: RoutePlan['status']) {
  switch (status) {
    case 'Conflict':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    case 'Disrupted':
      return { bg: '#ffecec', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    default:
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
  }
}

function getStopColor(status: RouteStop['status']) {
  switch (status) {
    case 'Blocked':
      return { bg: '#ffecec', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'Current':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    case 'Complete':
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
    default:
      return { bg: '#f7fafc', border: '#d9e3ed', main: '#8192a5', text: '#52677f' };
  }
}

function getLegColor(status: RouteLeg['status']) {
  switch (status) {
    case 'Blocked':
      return { bg: '#ffecec', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'Delayed':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    default:
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
  }
}

function getRiskColor(risk: RiskLevel) {
  switch (risk) {
    case 'High':
      return { bg: '#ffecec', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'Medium':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    default:
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
  }
}

function smallChipSx(color: { bg: string; border: string; text: string }) {
  return {
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontSize: 11,
    fontWeight: 900,
    height: 24,
  };
}

const sectionEyebrowSx = {
  color: '#159d95',
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1.4,
};

const toneColors = {
  amber: { bg: '#fff8ed', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' },
  blue: { bg: '#f2f7ff', border: '#c9daf5', main: '#4b68cf', text: '#263f98' },
  green: { bg: '#effaf5', border: '#bce6cf', main: '#2f8f6b', text: '#237155' },
  red: { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' },
};
