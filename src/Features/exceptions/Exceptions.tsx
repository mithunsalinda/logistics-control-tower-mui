import {
  AssignmentIndRounded,
  CheckCircleRounded,
  ErrorRounded,
  NotificationsActiveRounded,
  PlayCircleRounded,
  RuleRounded,
  SearchRounded,
  SettingsSuggestRounded,
  WarningRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import {
  type ExceptionItem,
  type ExceptionStatus,
} from '../../store';
import OperationsHeader from '../dashboard/OperationsHeader';
import {
  assigneeOptions,
  statusOptions,
  type AlertThresholds,
  type ExceptionStatusFilter,
} from './exceptions.constants';
import {
  chipSx,
  formatDateTime,
  getSeverityColor,
  getStatusColor,
  isPreviewException,
  tonePalette,
} from './exceptions.utils';
import {
  assigneeSelectSx,
  cardIconTileSx,
  exceptionCardSx,
  exceptionStyles,
  metricCardSx,
  metricValueSx,
  toastSx,
  warningIconSx,
} from './Exceptions.styles';
import { useExceptionsController } from './useExceptionsController';

export default function Exceptions() {
  const {
    criticalNew,
    handleAssigneeChange,
    handleStatusChange,
    isFetching,
    isUpdating,
    queue,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    setThresholds,
    setToastException,
    statusFilter,
    thresholds,
    toastException,
  } = useExceptionsController();

  return (
    <Stack spacing={3} sx={exceptionStyles.root}>
      <OperationsHeader
        pageName="Exception Management"
        liveUpdate
        title="EXCEPTION MANAGEMENT & ALERTING"
        desc="Live severity queue, operator assignment, lifecycle tracking and presentation-level alert thresholds."
      />

      {criticalNew.length > 0 && <PersistentCriticalBanner exceptions={criticalNew} />}
      {toastException && <LiveNotification exception={toastException} onClose={() => setToastException(null)} />}

      <Box
        sx={exceptionStyles.contentGrid}
      >
        <Stack spacing={2}>
          <QueueToolbar
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          <SummaryStrip queue={queue} />

          <Stack spacing={1.4} sx={exceptionStyles.queueList}>
            {queue.length > 0 ? (
              queue.map((exception) => (
                <ExceptionCard
                  key={exception.id}
                  disabled={isUpdating || isPreviewException(exception)}
                  exception={exception}
                  onAssigneeChange={handleAssigneeChange}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <Paper sx={exceptionStyles.emptyPaper}>
                <Typography variant="body1" color="textSecondary">
                  {isFetching ? 'Loading exceptions...' : 'No exceptions found'}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Stack>

        <AlertRulesPanel thresholds={thresholds} onThresholdChange={setThresholds} />
      </Box>
    </Stack>
  );
}

function PersistentCriticalBanner({ exceptions }: { exceptions: ExceptionItem[] }) {
  return (
    <Box
      sx={exceptionStyles.criticalBanner}
    >
      <Stack direction="row" spacing={1} sx={exceptionStyles.criticalBannerRow}>
        <NotificationsActiveRounded sx={exceptionStyles.criticalIcon} />
        <Box>
          <Typography sx={exceptionStyles.criticalTitle}>
            Critical alert requires acknowledgement
          </Typography>
          <Typography sx={exceptionStyles.criticalDescription}>
            {exceptions.map((exception) => `${exception.id} ${exception.title}`).join(', ')}
          </Typography>
        </Box>
      </Stack>
      <Chip color="error" label={`${exceptions.length} persistent`} />
    </Box>
  );
}

function LiveNotification({
  exception,
  onClose,
}: {
  exception: ExceptionItem;
  onClose: () => void;
}) {
  const color = getSeverityColor(exception.severity);

  return (
    <Box
      sx={toastSx(color)}
    >
      <Stack direction="row" spacing={1} sx={exceptionStyles.toastRow}>
        <WarningRounded sx={warningIconSx(color.main)} />
        <Box sx={exceptionStyles.toastContent}>
          <Typography sx={exceptionStyles.toastTitle}>
            New {exception.severity.toLowerCase()} exception
          </Typography>
          <Typography sx={exceptionStyles.toastDescription}>
            {exception.title} / {exception.shipmentId}
          </Typography>
        </Box>
        {exception.severity !== 'Critical' && (
          <Button size="small" onClick={onClose}>
            Clear
          </Button>
        )}
      </Stack>
    </Box>
  );
}

function QueueToolbar({
  onSearchChange,
  onStatusChange,
  searchTerm,
  statusFilter,
}: {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ExceptionStatusFilter) => void;
  searchTerm: string;
  statusFilter: ExceptionStatusFilter;
}) {
  return (
    <Box
      sx={exceptionStyles.toolbar}
    >
      <Box
        sx={exceptionStyles.searchShell}
      >
        <SearchRounded sx={exceptionStyles.searchIcon} />
        <Box
          component="input"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search exception, shipment, category, assignee..."
          sx={exceptionStyles.searchInput}
        />
      </Box>
      <Select
        value={statusFilter}
        onChange={(event: SelectChangeEvent) =>
          onStatusChange(event.target.value as ExceptionStatusFilter)
        }
        sx={exceptionStyles.statusSelect}
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

function SummaryStrip({ queue }: { queue: ExceptionItem[] }) {
  const active = queue.filter((exception) => exception.status !== 'Resolved').length;
  const critical = queue.filter((exception) => exception.severity === 'Critical').length;
  const unassigned = queue.filter((exception) => exception.assignee === 'Unassigned').length;

  return (
    <Box sx={exceptionStyles.summaryGrid}>
      <MetricCard label="Active queue" value={active} tone="blue" />
      <MetricCard label="Critical" value={critical} tone="red" />
      <MetricCard label="Unassigned" value={unassigned} tone="amber" />
      <MetricCard label="Total visible" value={queue.length} tone="green" />
    </Box>
  );
}

function MetricCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'amber' | 'blue' | 'green' | 'red';
  value: number;
}) {
  const color = tonePalette[tone];

  return (
    <Box
      sx={metricCardSx(color)}
    >
      <Typography sx={exceptionStyles.metricLabel}>{label}</Typography>
      <Typography sx={metricValueSx(color)}>{value}</Typography>
    </Box>
  );
}

function ExceptionCard({
  disabled,
  exception,
  onAssigneeChange,
  onStatusChange,
}: {
  disabled: boolean;
  exception: ExceptionItem;
  onAssigneeChange: (exception: ExceptionItem, assignee: string) => void;
  onStatusChange: (exception: ExceptionItem, status: ExceptionStatus) => void;
}) {
  const severityColor = getSeverityColor(exception.severity);
  const statusColor = getStatusColor(exception.status);

  return (
    <Box
      sx={exceptionCardSx(exception, severityColor)}
    >
      <Box
        sx={cardIconTileSx(severityColor)}
      >
        {exception.severity === 'Critical' ? <ErrorRounded /> : <WarningRounded />}
      </Box>

      <Box sx={exceptionStyles.cardContent}>
        <Stack direction="row" spacing={0.8} sx={exceptionStyles.cardHeader}>
          <Typography sx={exceptionStyles.cardTitle}>
            {exception.title}
          </Typography>
          <Chip label={exception.severity} sx={chipSx(severityColor)} />
          <Chip label={exception.status} sx={chipSx(statusColor)} />
          <Chip label={exception.category} />
          <Chip label={exception.domain} />
        </Stack>

        <Typography sx={exceptionStyles.cardDescription}>
          {exception.description}
        </Typography>

        <Typography sx={exceptionStyles.cardMeta}>
          {exception.id} / {exception.shipmentId} / {formatDateTime(exception.timestamp)}
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Stack direction="row" spacing={0.8} sx={exceptionStyles.assigneeRow}>
          <AssignmentIndRounded sx={exceptionStyles.assigneeIcon} />
          <Select
            value={exception.assignee}
            disabled={disabled}
            onChange={(event) => onAssigneeChange(exception, event.target.value)}
            sx={assigneeSelectSx}
          >
            {assigneeOptions.map((assignee) => (
              <MenuItem key={assignee} value={assignee}>
                {assignee}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" spacing={0.8} sx={exceptionStyles.actionRow}>
          <Button
            size="small"
            variant="outlined"
            disabled={disabled || exception.status === 'Acknowledged'}
            startIcon={<CheckCircleRounded />}
            onClick={() => onStatusChange(exception, 'Acknowledged')}
          >
            Ack
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={disabled || exception.status === 'In Progress'}
            startIcon={<PlayCircleRounded />}
            onClick={() => onStatusChange(exception, 'In Progress')}
          >
            Start
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={disabled || exception.status === 'Resolved'}
            onClick={() => onStatusChange(exception, 'Resolved')}
          >
            Resolve
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function AlertRulesPanel({
  onThresholdChange,
  thresholds,
}: {
  onThresholdChange: (value: AlertThresholds) => void;
  thresholds: AlertThresholds;
}) {
  const setThreshold = (key: keyof typeof thresholds, value: string) => {
    onThresholdChange({ ...thresholds, [key]: Number(value) });
  };

  return (
    <Box
      sx={exceptionStyles.rulesPanel}
    >
      <Stack direction="row" spacing={1} sx={exceptionStyles.rulesHeader}>
        <SettingsSuggestRounded sx={exceptionStyles.accentIcon} />
        <Box>
          <Typography sx={exceptionStyles.rulesTitle}>
            Alerting Rules
          </Typography>
          <Typography sx={exceptionStyles.rulesDescription}>
            Presentation/subscription thresholds
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1.4}>
        <RuleInput
          label="Dwell breach"
          suffix="min"
          value={thresholds.dwellMinutes}
          onChange={(value) => setThreshold('dwellMinutes', value)}
        />
        <RuleInput
          label="ETA slippage"
          suffix="min"
          value={thresholds.etaSlippageMinutes}
          onChange={(value) => setThreshold('etaSlippageMinutes', value)}
        />
        <RuleInput
          label="Missed scan"
          suffix="min"
          value={thresholds.missedScanMinutes}
          onChange={(value) => setThreshold('missedScanMinutes', value)}
        />
        <RuleInput
          label="Reefer upper temp"
          suffix="C"
          value={thresholds.reeferMaxTemp}
          onChange={(value) => setThreshold('reeferMaxTemp', value)}
        />
      </Stack>

      <Box sx={exceptionStyles.subscriptionBox}>
        <Stack direction="row" spacing={1} sx={exceptionStyles.subscriptionRow}>
          <RuleRounded sx={exceptionStyles.ruleIcon} />
          <Typography sx={exceptionStyles.subscriptionTitle}>
            Active subscriptions
          </Typography>
        </Stack>
        <Typography sx={exceptionStyles.subscriptionText}>
          Alerts above these thresholds enter the live queue and notification center. Critical alerts stay
          visible until acknowledgement.
        </Typography>
      </Box>
    </Box>
  );
}

function RuleInput({
  label,
  onChange,
  suffix,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  suffix: string;
  value: number;
}) {
  return (
    <Box>
      <Stack direction="row" sx={exceptionStyles.ruleInputHeader}>
        <Typography sx={exceptionStyles.ruleLabel}>{label}</Typography>
        <Typography sx={exceptionStyles.ruleValue}>
          {value} {suffix}
        </Typography>
      </Stack>
      <TextField
        fullWidth
        type="number"
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={exceptionStyles.ruleTextField}
      />
      <LinearProgress
        variant="determinate"
        value={Math.min(100, value)}
        sx={exceptionStyles.ruleProgress}
      />
    </Box>
  );
}
