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

import {
  type Facility,
  type FacilityEvent,
  type YardAppointment,
} from '../../store';
import OperationsHeader from '../dashboard/OperationsHeader';
import {
  chipSx,
  formatDateTime,
  getSeverityColor,
  getStatusColor,
  getUtilizationColor,
  getYardStatusColor,
  tonePalette,
} from './facilities.utils';
import {
  facilityButtonSx,
  facilityStyles,
  metricCardSx,
  metricValueSx,
  panelSx,
  progressValueSx,
} from './Facilities.styles';
import { useFacilitiesController } from './useFacilitiesController';

export default function Facilities() {
  const {
    isFetching,
    regionFacilities,
    searchText,
    selectedDataRegion,
    selectedFacility,
    setSearchText,
    setSelectedFacilityId,
    summary,
  } = useFacilitiesController();

  return (
    <Stack spacing={3} sx={facilityStyles.root}>
      <OperationsHeader
        pageName="Facilities"
        liveUpdate={false}
        title="WAREHOUSE & FACILITY COORDINATION"
        desc={`Dock utilization, facility events, affected loads and yard appointments in ${selectedDataRegion}.`}
      />

      <Box sx={facilityStyles.metricGrid}>
        <MetricCard label="Visible facilities" value={isFetching ? '...' : String(regionFacilities.length)} tone="blue" />
        <MetricCard label="Constrained" value={String(summary.constrainedFacilities)} tone="red" />
        <MetricCard label="Facility events" value={String(summary.totalEvents)} tone="amber" />
        <MetricCard label="Yard appointments" value={String(summary.totalAppointments)} tone="green" />
      </Box>

      <Box sx={facilityStyles.contentGrid}>
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

            <Box sx={facilityStyles.detailGrid}>
              <FacilityEventsPanel events={selectedFacility.events} />
              <AppointmentsPanel appointments={selectedFacility.appointments} />
            </Box>

            <LoadCorrelationPanel facility={selectedFacility} affectedShipments={summary.affectedShipments} />
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
      sx={facilityStyles.searchBox}
    >
      <SearchRounded sx={facilityStyles.searchIcon} />
      <Box
        component="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search facility or event..."
        sx={facilityStyles.searchInput}
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
            sx={facilityButtonSx(facility.id === selectedFacilityId, statusColor)}
          >
            <Stack direction="row" sx={facilityStyles.listHeader}>
              <Box>
                <Typography sx={facilityStyles.facilityCode}>
                  {facility.code}
                </Typography>
                <Typography sx={facilityStyles.facilityName}>
                  {facility.name}
                </Typography>
              </Box>
              <Chip label={facility.status} sx={chipSx(statusColor)} />
            </Stack>
            <Stack direction="row" spacing={0.7} sx={facilityStyles.chipWrap}>
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
      sx={facilityStyles.dashboardPanel}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        sx={facilityStyles.dashboardHeader}
      >
        <Stack direction="row" spacing={1.5} sx={facilityStyles.identityRow}>
          <Box sx={facilityStyles.progressWrap}>
            <CircularProgress variant="determinate" value={100} size={118} thickness={4} sx={facilityStyles.progressTrack} />
            <CircularProgress
              variant="determinate"
              value={facility.dockUtilization}
              size={118}
              thickness={4}
              sx={progressValueSx(utilizationColor)}
            />
            <Box
              sx={facilityStyles.progressCenter}
            >
              <Box>
                <Typography sx={facilityStyles.utilizationValue}>
                  {facility.dockUtilization}%
                </Typography>
                <Typography sx={facilityStyles.utilizationLabel}>
                  Dock doors
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography sx={facilityStyles.eyebrow}>
              FACILITY DASHBOARD
            </Typography>
            <Typography sx={facilityStyles.dashboardTitle}>
              {facility.name}
            </Typography>
            <Stack direction="row" spacing={0.8} sx={facilityStyles.dashboardChips}>
              <Chip label={facility.status} sx={chipSx(statusColor)} />
              <Chip label={`Staffing ${facility.staffing}`} />
              <Chip label={`${facility.activeDoors} active doors`} />
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={facilityStyles.dashboardMetricGrid}
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
      <Stack direction="row" spacing={1} sx={facilityStyles.panelHeader}>
        <ErrorRounded sx={facilityStyles.eventIcon} />
        <Box>
          <Typography sx={facilityStyles.eyebrow}>EVENT CORRELATION</Typography>
          <Typography sx={facilityStyles.panelTitle}>
            Dock & Congestion Events
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        {events.length === 0 ? (
          <Typography sx={facilityStyles.emptyText}>No active facility events.</Typography>
        ) : (
          events.map((event) => (
            <Box key={event.id} sx={facilityStyles.eventCard}>
              <Stack direction="row" sx={facilityStyles.eventHeader}>
                <Box>
                  <Typography sx={facilityStyles.itemTitle}>
                    {event.type}
                  </Typography>
                  <Typography sx={facilityStyles.itemMeta}>
                    {formatDateTime(event.timestamp)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.7}>
                  <Chip label={event.severity} sx={chipSx(getSeverityColor(event.severity))} />
                  <Chip label={event.status} />
                </Stack>
              </Stack>
              <Typography sx={facilityStyles.itemDescription}>
                {event.description}
              </Typography>
              <Stack direction="row" spacing={0.7} sx={facilityStyles.itemChips}>
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
      <Stack direction="row" spacing={1} sx={facilityStyles.panelHeader}>
        <AssignmentTurnedInRounded sx={facilityStyles.accentIcon} />
        <Box>
          <Typography sx={facilityStyles.eyebrow}>YARD & APPOINTMENTS</Typography>
          <Typography sx={facilityStyles.panelTitle}>
            Scheduled Arrivals
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        {appointments.length === 0 ? (
          <Typography sx={facilityStyles.emptyText}>No scheduled arrivals.</Typography>
        ) : (
          appointments.map((appointment) => (
            <Box key={appointment.id} sx={facilityStyles.eventCard}>
              <Stack direction="row" sx={facilityStyles.itemHeader}>
                <Box>
                  <Typography sx={facilityStyles.itemTitle}>
                    {appointment.shipmentId}
                  </Typography>
                  <Typography sx={facilityStyles.itemMeta}>
                    {appointment.carrier} / {appointment.trailerId}
                  </Typography>
                </Box>
                <Chip label={appointment.yardStatus} sx={chipSx(getYardStatusColor(appointment.yardStatus))} />
              </Stack>
              <Divider sx={facilityStyles.divider} />
              <Stack direction="row" spacing={1} sx={facilityStyles.appointmentFooter}>
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
      <Stack direction="row" spacing={1} sx={facilityStyles.panelHeader}>
        <LocalShippingRounded sx={facilityStyles.accentIcon} />
        <Box>
          <Typography sx={facilityStyles.eyebrow}>LOAD CORRELATION</Typography>
          <Typography sx={facilityStyles.panelTitle}>
            Affected Shipments & Loads
          </Typography>
        </Box>
      </Stack>
      <Box sx={facilityStyles.correlationGrid}>
        <SmallMetric icon={<GroupsRounded />} label="Facility affected" value={String(facility.affectedShipments)} />
        <SmallMetric icon={<GroupsRounded />} label="Region affected" value={String(affectedShipments)} />
        <SmallMetric icon={<ArrowDownwardRounded />} label="Inbound loads" value={String(facility.inboundLoads)} />
        <SmallMetric icon={<ArrowUpwardRounded />} label="Outbound loads" value={String(facility.outboundLoads)} />
      </Box>
      <Typography sx={facilityStyles.correlationDescription}>
        Facility events above are correlated to impacted shipment references and current inbound/outbound load counts.
      </Typography>
    </Box>
  );
}

function SmallMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={facilityStyles.smallMetric}>
      <Stack direction="row" spacing={0.6} sx={facilityStyles.smallMetricHeader}>
        {icon}
        <Typography sx={facilityStyles.smallMetricLabel}>{label}</Typography>
      </Stack>
      <Typography sx={facilityStyles.smallMetricValue}>{value}</Typography>
    </Box>
  );
}

function SmallInline({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Stack direction="row" spacing={0.6} sx={facilityStyles.inlineSignal}>
      {icon}
      <Typography sx={facilityStyles.inlineSignalText}>{label}</Typography>
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
      sx={metricCardSx(color)}
    >
      <Typography sx={facilityStyles.metricLabel}>{label}</Typography>
      <Typography sx={metricValueSx(color)}>{value}</Typography>
    </Box>
  );
}

function EmptyState() {
  return (
    <Box sx={facilityStyles.emptyState}>
      <FactoryRounded sx={facilityStyles.emptyIcon} />
      <Typography sx={facilityStyles.emptyTitle}>
        No facilities found
      </Typography>
      <Typography sx={facilityStyles.emptyDescription}>
        Adjust the search criteria or change the header region.
      </Typography>
    </Box>
  );
}
