import { useEffect, useMemo, useState } from 'react';

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
  useGetExceptionsQuery,
  useUpdateExceptionMutation,
  type ExceptionItem,
  type ExceptionSeverity,
  type ExceptionStatus,
} from '../../store';
import OperationsHeader from '../dashboard/OperationsHeader';

const severityRank: Record<ExceptionSeverity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const statusOptions = ['Active', 'All', 'New', 'Acknowledged', 'In Progress', 'Resolved'] as const;
const assigneeOptions = ['Unassigned', 'Demo Dispatcher', 'N. Gomez', 'M. Carter', 'K. Patel', 'S. Tanaka'];

const livePreviewException: ExceptionItem = {
  id: 'LIVE-ETA-20260819',
  title: 'Live ETA Slippage',
  category: 'Delay',
  domain: 'Shipments',
  severity: 'High',
  status: 'New',
  description: 'A subscribed ETA rule detected a projected delivery-window breach.',
  shipmentId: 'SHP-00009',
  timestamp: new Date().toISOString(),
  assignee: 'Unassigned',
};

export default function Exceptions() {
  const {
    data: exceptions = [],
    isFetching,
    refetch,
  } = useGetExceptionsQuery(undefined, { pollingInterval: 15000 });
  const [updateException, { isLoading: isUpdating }] = useUpdateExceptionMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('Active');
  const [livePreviewVisible, setLivePreviewVisible] = useState(false);
  const [toastException, setToastException] = useState<ExceptionItem | null>(null);
  const [thresholds, setThresholds] = useState({
    dwellMinutes: 45,
    etaSlippageMinutes: 30,
    missedScanMinutes: 20,
    reeferMaxTemp: 8,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLivePreviewVisible(true);
      setToastException(livePreviewException);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toastException || toastException.severity === 'Critical') {
      return;
    }

    const timer = window.setTimeout(() => setToastException(null), 5000);

    return () => window.clearTimeout(timer);
  }, [toastException]);

  const queue = useMemo(() => {
    const visibleExceptions = livePreviewVisible ? [livePreviewException, ...exceptions] : exceptions;

    return visibleExceptions
      .filter((exception) => {
        const query = searchTerm.trim().toLowerCase();
        const searchable = [
          exception.id,
          exception.title,
          exception.description,
          exception.shipmentId,
          exception.category,
          exception.domain,
          exception.assignee,
        ]
          .join(' ')
          .toLowerCase();

        const activeMatch =
          statusFilter === 'Active'
            ? exception.status !== 'Resolved'
            : statusFilter === 'All' || exception.status === statusFilter;

        return activeMatch && (query.length === 0 || searchable.includes(query));
      })
      .sort((left, right) => {
        const severityDelta = severityRank[right.severity] - severityRank[left.severity];

        if (severityDelta !== 0) {
          return severityDelta;
        }

        return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
      });
  }, [exceptions, livePreviewVisible, searchTerm, statusFilter]);

  const criticalNew = queue.filter(
    (exception) => exception.severity === 'Critical' && exception.status === 'New',
  );

  const handleStatusChange = async (exception: ExceptionItem, status: ExceptionStatus) => {
    if (exception.id.startsWith('LIVE-')) {
      setLivePreviewVisible(false);
      setToastException(null);
      return;
    }

    await updateException({ id: exception.id, status }).unwrap();
    await refetch();
  };

  const handleAssigneeChange = async (exception: ExceptionItem, assignee: string) => {
    if (exception.id.startsWith('LIVE-')) {
      return;
    }

    await updateException({ id: exception.id, assignee }).unwrap();
    await refetch();
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <OperationsHeader
        pageName="Exception Management"
        liveUpdate
        title="EXCEPTION MANAGEMENT & ALERTING"
        desc="Live severity queue, operator assignment, lifecycle tracking and presentation-level alert thresholds."
      />

      {criticalNew.length > 0 && <PersistentCriticalBanner exceptions={criticalNew} />}
      {toastException && <LiveNotification exception={toastException} onClose={() => setToastException(null)} />}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Stack spacing={2}>
          <QueueToolbar
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          <SummaryStrip queue={queue} />

          <Stack spacing={1.4} sx={{ backgroundColor: 'var(--app-surface-soft)', p: 1.5, borderRadius: '10px' }}>
            {queue.length > 0 ? (
              queue.map((exception) => (
                <ExceptionCard
                  key={exception.id}
                  disabled={isUpdating || exception.id.startsWith('LIVE-')}
                  exception={exception}
                  onAssigneeChange={handleAssigneeChange}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', border: '1px solid #edf1f6' }}>
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
      sx={{
        border: '1px solid #ffb5b5',
        borderLeft: '5px solid #d32f2f',
        borderRadius: '8px',
        backgroundColor: '#fff0f0',
        px: 1.8,
        py: 1.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        flexWrap: 'wrap',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <NotificationsActiveRounded sx={{ color: '#d32f2f' }} />
        <Box>
          <Typography sx={{ color: '#8f1d1d', fontSize: 14, fontWeight: 900 }}>
            Critical alert requires acknowledgement
          </Typography>
          <Typography sx={{ color: '#9a4d4d', fontSize: 12 }}>
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
      sx={{
        position: 'fixed',
        top: 92,
        right: 24,
        zIndex: (theme) => theme.zIndex.snackbar,
        width: { xs: 'calc(100% - 32px)', sm: 360 },
        border: `1px solid ${color.border}`,
        borderLeft: `5px solid ${color.main}`,
        borderRadius: '8px',
        backgroundColor: 'var(--app-surface)',
        boxShadow: '0 18px 38px rgba(25, 43, 62, 0.18)',
        p: 1.4,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <WarningRounded sx={{ color: color.main, mt: 0.2 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: 'var(--app-text)', fontSize: 13, fontWeight: 900 }}>
            New {exception.severity.toLowerCase()} exception
          </Typography>
          <Typography sx={{ color: '#52677f', fontSize: 12, mt: 0.4 }}>
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
  onStatusChange: (value: (typeof statusOptions)[number]) => void;
  searchTerm: string;
  statusFilter: (typeof statusOptions)[number];
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, 1fr) 190px' },
        gap: 1,
        border: '1px solid var(--app-border)',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface-soft)',
        p: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 38,
          borderRadius: '8px',
          border: '1px solid var(--app-border)',
          backgroundColor: 'var(--app-surface)',
          px: 1.3,
          gap: 1,
        }}
      >
        <SearchRounded sx={{ color: '#2c4058', fontSize: 18 }} />
        <Box
          component="input"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search exception, shipment, category, assignee..."
          sx={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            color: 'var(--app-text)',
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
          backgroundColor: 'var(--app-surface)',
          color: 'var(--app-text)',
          fontSize: 13,
          fontWeight: 800,
          '& fieldset': { borderColor: 'var(--app-border)', borderRadius: '8px' },
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

function SummaryStrip({ queue }: { queue: ExceptionItem[] }) {
  const active = queue.filter((exception) => exception.status !== 'Resolved').length;
  const critical = queue.filter((exception) => exception.severity === 'Critical').length;
  const unassigned = queue.filter((exception) => exception.assignee === 'Unassigned').length;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
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
      sx={{
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.main}`,
        borderRadius: '8px',
        backgroundColor: color.bg,
        p: 1.4,
      }}
    >
      <Typography sx={{ color: '#5d7088', fontSize: 11, fontWeight: 900 }}>{label}</Typography>
      <Typography sx={{ color: color.text, fontSize: 26, fontWeight: 900 }}>{value}</Typography>
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
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: '64px minmax(0, 1fr) 330px' },
        gap: 1.5,
        alignItems: 'start',
        border: `1px solid ${exception.severity === 'Critical' && exception.status !== 'Acknowledged' ? '#ffb5b5' : '#edf1f6'}`,
        borderLeft: `5px solid ${severityColor.main}`,
        borderRadius: '8px',
        backgroundColor: 'var(--app-surface)',
        p: 1.5,
        boxShadow:
          exception.severity === 'Critical' && exception.status === 'New'
            ? '0 10px 28px rgba(211, 47, 47, 0.12)'
            : 'none',
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '10px',
          backgroundColor: severityColor.bg,
          display: 'grid',
          placeItems: 'center',
          color: severityColor.main,
        }}
      >
        {exception.severity === 'Critical' ? <ErrorRounded /> : <WarningRounded />}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.8 }}>
          <Typography sx={{ color: 'var(--app-text)', fontSize: 16, fontWeight: 900 }}>
            {exception.title}
          </Typography>
          <Chip label={exception.severity} sx={chipSx(severityColor)} />
          <Chip label={exception.status} sx={chipSx(statusColor)} />
          <Chip label={exception.category} />
          <Chip label={exception.domain} />
        </Stack>

        <Typography sx={{ color: '#647b99', fontSize: 13, lineHeight: 1.5, mt: 1 }}>
          {exception.description}
        </Typography>

        <Typography sx={{ color: 'var(--app-text-soft)', fontSize: 11, fontWeight: 700, mt: 1 }}>
          {exception.id} / {exception.shipmentId} / {formatDateTime(exception.timestamp)}
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
          <AssignmentIndRounded sx={{ color: '#5d7088', fontSize: 18 }} />
          <Select
            value={exception.assignee}
            disabled={disabled}
            onChange={(event) => onAssigneeChange(exception, event.target.value)}
            sx={{
              height: 36,
              flex: 1,
              backgroundColor: 'var(--app-surface)',
              fontSize: 13,
              fontWeight: 800,
              '& fieldset': { borderColor: 'var(--app-border)', borderRadius: '8px' },
            }}
          >
            {assigneeOptions.map((assignee) => (
              <MenuItem key={assignee} value={assignee}>
                {assignee}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap', rowGap: 0.8 }}>
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
  onThresholdChange: (value: {
    dwellMinutes: number;
    etaSlippageMinutes: number;
    missedScanMinutes: number;
    reeferMaxTemp: number;
  }) => void;
  thresholds: {
    dwellMinutes: number;
    etaSlippageMinutes: number;
    missedScanMinutes: number;
    reeferMaxTemp: number;
  };
}) {
  const setThreshold = (key: keyof typeof thresholds, value: string) => {
    onThresholdChange({ ...thresholds, [key]: Number(value) });
  };

  return (
    <Box
      sx={{
        position: { lg: 'sticky' },
        top: { lg: 96 },
        border: '1px solid var(--app-border)',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface)',
        p: 1.8,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
        <SettingsSuggestRounded sx={{ color: '#159d95' }} />
        <Box>
          <Typography sx={{ color: 'var(--app-text)', fontSize: 16, fontWeight: 900 }}>
            Alerting Rules
          </Typography>
          <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 12 }}>
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

      <Box sx={{ border: '1px solid var(--app-border)', borderRadius: '8px', backgroundColor: 'var(--app-surface-soft)', p: 1.2, mt: 1.6 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <RuleRounded sx={{ color: '#53677f', fontSize: 18 }} />
          <Typography sx={{ color: '#334a63', fontSize: 12, fontWeight: 900 }}>
            Active subscriptions
          </Typography>
        </Stack>
        <Typography sx={{ color: 'var(--app-text-muted)', fontSize: 12, mt: 0.8 }}>
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
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
        <Typography sx={{ color: '#334a63', fontSize: 12, fontWeight: 900 }}>{label}</Typography>
        <Typography sx={{ color: '#159d95', fontSize: 12, fontWeight: 900 }}>
          {value} {suffix}
        </Typography>
      </Stack>
      <TextField
        fullWidth
        type="number"
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'var(--app-surface)',
          },
        }}
      />
      <LinearProgress
        variant="determinate"
        value={Math.min(100, value)}
        sx={{
          height: 5,
          borderRadius: 999,
          mt: 0.8,
          backgroundColor: '#e3ebf2',
          '& .MuiLinearProgress-bar': { backgroundColor: '#159d95' },
        }}
      />
    </Box>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getSeverityColor(severity: ExceptionSeverity) {
  switch (severity) {
    case 'Critical':
      return { bg: '#fff0f0', border: '#ffb5b5', main: '#d32f2f', text: '#8f1d1d' };
    case 'High':
      return { bg: '#fff5e7', border: '#ffd29a', main: '#d66b29', text: '#9a4e0a' };
    case 'Medium':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    default:
      return { bg: '#e9f7f4', border: '#b9e4da', main: '#159d95', text: '#0c6863' };
  }
}

function getStatusColor(status: ExceptionStatus) {
  switch (status) {
    case 'Resolved':
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
    case 'In Progress':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    case 'Acknowledged':
      return { bg: '#fff5e7', border: '#ffd29a', main: '#d66b29', text: '#9a4e0a' };
    default:
      return { bg: '#fff0f0', border: '#ffb5b5', main: '#d32f2f', text: '#8f1d1d' };
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

const tonePalette = {
  amber: { bg: '#fff8ed', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' },
  blue: { bg: '#f2f7ff', border: '#c9daf5', main: '#4b68cf', text: '#263f98' },
  green: { bg: '#effaf5', border: '#bce6cf', main: '#2f8f6b', text: '#237155' },
  red: { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' },
};
