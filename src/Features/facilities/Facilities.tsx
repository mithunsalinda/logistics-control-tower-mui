import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';

import {
  AccessTimeRounded,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  AssignmentTurnedInRounded,
  DoorSlidingRounded,
  ErrorRounded,
  FactoryRounded,
  GroupsRounded,
  LocalShippingRounded,
  SearchRounded,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import type { RegionCode } from '../../config/regions';
import {
  useGetFacilitiesQuery,
  type Facility,
  type FacilityEvent,
  type YardAppointment,
} from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import OperationsHeader from '../dashboard/OperationsHeader';

export default function Facilities() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const selectedDataRegion = getDataRegion(region);
  const { data: facilities = [], isFetching } = useGetFacilitiesQuery();
  const [searchText, setSearchText] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  const regionFacilities = useMemo(
    () =>
      facilities.filter((facility) => {
        const query = searchText.trim().toLowerCase();
        const searchable = [
          facility.code,
          facility.name,
          facility.status,
          facility.staffing,
          facility.events.map((event) => event.type).join(' '),
        ]
          .join(' ')
          .toLowerCase();

        return facility.region === selectedDataRegion && (query.length === 0 || searchable.includes(query));
      }),
    [facilities, searchText, selectedDataRegion],
  );

  useEffect(() => {
    setSelectedFacilityId(regionFacilities[0]?.id ?? '');
  }, [regionFacilities]);

  const selectedFacility =
    regionFacilities.find((facility) => facility.id === selectedFacilityId) ?? regionFacilities[0];
  const totalEvents = regionFacilities.reduce((total, facility) => total + facility.events.length, 0);
  const totalAppointments = regionFacilities.reduce(
    (total, facility) => total + facility.appointments.length,
    0,
  );
  const constrainedFacilities = regionFacilities.filter((facility) => facility.status === 'Constrained').length;
  const affectedShipments = regionFacilities.reduce(
    (total, facility) => total + facility.affectedShipments,
    0,
  );

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <OperationsHeader
        pageName="Facilities"
        liveUpdate={false}
        title="WAREHOUSE & FACILITY COORDINATION"
        desc={`Dock utilization, facility events, affected loads and yard appointments in ${selectedDataRegion}.`}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 1.4,
        }}
      >
        <MetricCard label="Visible facilities" value={isFetching ? '...' : String(regionFacilities.length)} tone="blue" />
        <MetricCard label="Constrained" value={String(constrainedFacilities)} tone="red" />
        <MetricCard label="Facility events" value={String(totalEvents)} tone="amber" />
        <MetricCard label="Yard appointments" value={String(totalAppointments)} tone="green" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: '380px minmax(0, 1fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Stack spacing={1.4}>
          <SearchBox value={searchText} onChange={setSearchText} />
          <FacilityList
            facilities={regionFacilities}
            selectedFacilityId={selectedFacility?.id ?? ''}
            onSelect={setSelectedFacilityId}
          />
        </Stack>

        {selectedFacility ? (
          <Stack spacing={2}>
            <FacilityDashboard facility={selectedFacility} />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(360px, 0.9fr)' },
                gap: 2,
              }}
            >
              <FacilityEventsPanel events={selectedFacility.events} />
              <AppointmentsPanel appointments={selectedFacility.appointments} />
            </Box>

            <LoadCorrelationPanel facility={selectedFacility} affectedShipments={affectedShipments} />
          </Stack>
        ) : (
          <EmptyState />
        )}
      </Box>
    </Stack>
  );
}

function SearchBox({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
        border: '1px solid var(--app-border)',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface)',
        px: 1.3,
        gap: 1,
      }}
    >
      <SearchRounded sx={{ color: '#334a63', fontSize: 18 }} />
      <Box
        component="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search facility or event..."
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
  );
}

function FacilityList({
  facilities,
  onSelect,
  selectedFacilityId,
}: {
  facilities: Facility[];
  onSelect: (value: string) => void;
  selectedFacilityId: string;
}) {
  return (
    <Stack spacing={1}>
      {facilities.map((facility) => {
        const statusColor = getStatusColor(facility.status);

        return (
          <Box
            key={facility.id}
            component="button"
            onClick={() => onSelect(facility.id)}
            sx={{
              width: '100%',
              textAlign: 'left',
              border: `1px solid ${facility.id === selectedFacilityId ? '#159d95' : 'var(--app-border)'}`,
              borderLeft: `5px solid ${statusColor.main}`,
              borderRadius: '8px',
              backgroundColor: facility.id === selectedFacilityId
                ? 'color-mix(in srgb, #159d95 12%, var(--app-surface))'
                : 'var(--app-surface)',
              p: 1.4,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900 }}>
                  {facility.code}
                </Typography>
                <Typography sx={{ color: 'var(--app-text)', fontSize: 15, fontWeight: 900 }}>
                  {facility.name}
                </Typography>
              </Box>
              <Chip label={facility.status} sx={chipSx(statusColor)} />
            </Stack>
            <Stack direction="row" spacing={0.7} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.7 }}>
              <Chip size="small" label={`${facility.dockUtilization}% dock`} />
              <Chip size="small" label={`${facility.events.length} event(s)`} />
              <Chip size="small" label={`${facility.appointments.length} appointments`} />
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

function FacilityDashboard({ facility }: { facility: Facility }) {
  const statusColor = getStatusColor(facility.status);
  const utilizationColor = getUtilizationColor(facility.dockUtilization);

  return (
    <Box
      sx={{
        border: '1px solid var(--app-border)',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface)',
        p: 1.8,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', lg: 'center' } }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: 118, height: 118, flex: '0 0 auto' }}>
            <CircularProgress variant="determinate" value={100} size={118} thickness={4} sx={{ color: '#e8eef5', position: 'absolute' }} />
            <CircularProgress
              variant="determinate"
              value={facility.dockUtilization}
              size={118}
              thickness={4}
              sx={{ color: utilizationColor, position: 'absolute' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography sx={{ color: 'var(--app-text)', fontSize: 27, fontWeight: 900 }}>
                  {facility.dockUtilization}%
                </Typography>
                <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 10, fontWeight: 800 }}>
                  Dock doors
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
              FACILITY DASHBOARD
            </Typography>
            <Typography sx={{ color: 'var(--app-text)', fontSize: 25, fontWeight: 900 }}>
              {facility.name}
            </Typography>
            <Stack direction="row" spacing={0.8} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.8 }}>
              <Chip label={facility.status} sx={chipSx(statusColor)} />
              <Chip label={`Staffing ${facility.staffing}`} />
              <Chip label={`${facility.activeDoors} active doors`} />
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 120px)' },
            gap: 1,
            width: { xs: '100%', lg: 'auto' },
          }}
        >
          <SmallMetric icon={<ArrowDownwardRounded />} label="Inbound queue" value={String(facility.inboundQueue)} />
          <SmallMetric icon={<ArrowUpwardRounded />} label="Outbound queue" value={String(facility.outboundQueue)} />
          <SmallMetric icon={<AccessTimeRounded />} label="Avg dwell" value={`${facility.averageDwell}m`} />
          <SmallMetric icon={<GroupsRounded />} label="Affected" value={String(facility.affectedShipments)} />
        </Box>
      </Stack>
    </Box>
  );
}

function FacilityEventsPanel({ events }: { events: FacilityEvent[] }) {
  return (
    <Box sx={panelSx}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.3 }}>
        <ErrorRounded sx={{ color: '#d66b29' }} />
        <Box>
          <Typography sx={eyebrowSx}>EVENT CORRELATION</Typography>
          <Typography sx={{ color: 'var(--app-text)', fontSize: 19, fontWeight: 900 }}>
            Dock & Congestion Events
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        {events.length === 0 ? (
          <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 13 }}>No active facility events.</Typography>
        ) : (
          events.map((event) => (
            <Box key={event.id} sx={{ border: '1px solid var(--app-border)', borderRadius: '8px', p: 1.2 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, mb: 0.8 }}>
                <Box>
                  <Typography sx={{ color: 'var(--app-text)', fontSize: 14, fontWeight: 900 }}>
                    {event.type}
                  </Typography>
                  <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 11, fontWeight: 800 }}>
                    {formatDateTime(event.timestamp)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.7}>
                  <Chip label={event.severity} sx={chipSx(getSeverityColor(event.severity))} />
                  <Chip label={event.status} />
                </Stack>
              </Stack>
              <Typography sx={{ color: '#52677f', fontSize: 12, lineHeight: 1.45 }}>
                {event.description}
              </Typography>
              <Stack direction="row" spacing={0.7} sx={{ flexWrap: 'wrap', rowGap: 0.7, mt: 1 }}>
                {event.affectedShipments.map((shipmentId) => (
                  <Chip key={shipmentId} size="small" label={shipmentId} />
                ))}
                <Chip size="small" label={`${event.inboundLoads} inbound loads`} />
                <Chip size="small" label={`${event.outboundLoads} outbound loads`} />
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}

function AppointmentsPanel({ appointments }: { appointments: YardAppointment[] }) {
  return (
    <Box sx={panelSx}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.3 }}>
        <AssignmentTurnedInRounded sx={{ color: '#159d95' }} />
        <Box>
          <Typography sx={eyebrowSx}>YARD & APPOINTMENTS</Typography>
          <Typography sx={{ color: 'var(--app-text)', fontSize: 19, fontWeight: 900 }}>
            Scheduled Arrivals
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        {appointments.length === 0 ? (
          <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 13 }}>No scheduled arrivals.</Typography>
        ) : (
          appointments.map((appointment) => (
            <Box key={appointment.id} sx={{ border: '1px solid var(--app-border)', borderRadius: '8px', p: 1.2 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                <Box>
                  <Typography sx={{ color: 'var(--app-text)', fontSize: 14, fontWeight: 900 }}>
                    {appointment.shipmentId}
                  </Typography>
                  <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 11, fontWeight: 800 }}>
                    {appointment.carrier} / {appointment.trailerId}
                  </Typography>
                </Box>
                <Chip label={appointment.yardStatus} sx={chipSx(getYardStatusColor(appointment.yardStatus))} />
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 0.7 }}>
                <SmallInline icon={<AccessTimeRounded />} label={formatDateTime(appointment.appointmentTime)} />
                <SmallInline icon={<DoorSlidingRounded />} label={appointment.door} />
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}

function LoadCorrelationPanel({
  affectedShipments,
  facility,
}: {
  affectedShipments: number;
  facility: Facility;
}) {
  return (
    <Box sx={panelSx}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.3 }}>
        <LocalShippingRounded sx={{ color: '#159d95' }} />
        <Box>
          <Typography sx={eyebrowSx}>LOAD CORRELATION</Typography>
          <Typography sx={{ color: 'var(--app-text)', fontSize: 19, fontWeight: 900 }}>
            Affected Shipments & Loads
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
        <SmallMetric icon={<GroupsRounded />} label="Facility affected" value={String(facility.affectedShipments)} />
        <SmallMetric icon={<GroupsRounded />} label="Region affected" value={String(affectedShipments)} />
        <SmallMetric icon={<ArrowDownwardRounded />} label="Inbound loads" value={String(facility.inboundLoads)} />
        <SmallMetric icon={<ArrowUpwardRounded />} label="Outbound loads" value={String(facility.outboundLoads)} />
      </Box>
      <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 12, mt: 1.2 }}>
        Facility events above are correlated to impacted shipment references and current inbound/outbound load counts.
      </Typography>
    </Box>
  );
}

function SmallMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid var(--app-border)', borderRadius: '8px', p: 1, backgroundColor: 'var(--app-surface-soft)' }}>
      <Stack direction="row" spacing={0.6} sx={{ color: 'var(--app-text-muted)', alignItems: 'center' }}>
        {icon}
        <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 10, fontWeight: 900 }}>{label}</Typography>
      </Stack>
      <Typography sx={{ color: 'var(--app-text)', fontSize: 18, fontWeight: 900, mt: 0.4 }}>{value}</Typography>
    </Box>
  );
}

function SmallInline({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center', color: '#52677f' }}>
      {icon}
      <Typography sx={{ color: '#52677f', fontSize: 12, fontWeight: 800 }}>{label}</Typography>
    </Stack>
  );
}

function MetricCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'amber' | 'blue' | 'green' | 'red';
  value: string;
}) {
  const color = tonePalette[tone];

  return (
    <Box
      sx={{
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.main}`,
        borderRadius: '8px',
        backgroundColor: color.bg,
        p: 1.5,
      }}
    >
      <Typography sx={{ color: '#5d7088', fontSize: 12, fontWeight: 900 }}>{label}</Typography>
      <Typography sx={{ color: color.text, fontSize: 26, fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

function EmptyState() {
  return (
    <Box sx={{ border: '1px solid var(--app-border)', borderRadius: '10px', backgroundColor: 'var(--app-surface)', p: 4, textAlign: 'center' }}>
      <FactoryRounded sx={{ color: '#9fb0c1', fontSize: 34 }} />
      <Typography sx={{ color: 'var(--app-text)', fontSize: 19, fontWeight: 900, mt: 1 }}>
        No facilities found
      </Typography>
      <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 13, mt: 0.5 }}>
        Adjust the search criteria or change the header region.
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

function getUtilizationColor(value: number) {
  if (value >= 85) {
    return '#d74d4d';
  }

  if (value >= 75) {
    return '#d66b29';
  }

  return '#159d95';
}

function getStatusColor(status: Facility['status']) {
  return status === 'Constrained'
    ? { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' }
    : { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
}

function getSeverityColor(severity: FacilityEvent['severity']) {
  switch (severity) {
    case 'Critical':
      return { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'High':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    case 'Medium':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    default:
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
  }
}

function getYardStatusColor(status: YardAppointment['yardStatus']) {
  switch (status) {
    case 'Late':
      return { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'In Yard':
    case 'At Door':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    case 'Departed':
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
    default:
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
  }
}

function chipSx(color: { bg: string; border: string; text: string }) {
  return {
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontSize: 11,
    fontWeight: 900,
    height: 24,
  };
}

const panelSx = {
  border: '1px solid var(--app-border)',
  borderRadius: '10px',
  backgroundColor: 'var(--app-surface)',
  p: 1.8,
};

const eyebrowSx = {
  color: '#159d95',
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1.4,
};

const tonePalette = {
  amber: { bg: '#fff8ed', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' },
  blue: { bg: '#f2f7ff', border: '#c9daf5', main: '#4b68cf', text: '#263f98' },
  green: { bg: '#effaf5', border: '#bce6cf', main: '#2f8f6b', text: '#237155' },
  red: { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' },
};
