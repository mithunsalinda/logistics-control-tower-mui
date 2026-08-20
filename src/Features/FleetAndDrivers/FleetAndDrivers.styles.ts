import type { SxProps, Theme } from '@mui/material';

export type FleetSummaryTone = 'neutral' | 'warning' | 'critical' | 'stale';
export type MetricTone = 'normal' | 'warning' | 'critical';

export const fleetStyles = {
  root: { width: '100%' },
  headerOffset: { pt: 0.5 },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
    gap: 1.5,
  },
  filterBar: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'minmax(260px, 1.6fr) repeat(3, minmax(150px, 0.8fr))',
    },
    gap: 1,
    border: '1px solid #d9e3ed',
    borderRadius: '12px',
    backgroundColor: '#f4f8fb',
    p: 1.2,
  },
  vehicleGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, minmax(0, 1fr))',
      xl: 'repeat(3, minmax(0, 1fr))',
    },
    gap: 2,
    alignItems: 'stretch',
  },
  emptyState: {
    gridColumn: '1 / -1',
    border: '1px solid #d9e3ed',
    borderRadius: '12px',
    backgroundColor: '#f9fbfd',
    py: 4,
    textAlign: 'center',
    color: '#64798f',
    fontSize: 14,
  },
  vehicleHeader: { justifyContent: 'space-between', gap: 1, mb: 1.5 },
  vehicleIdentity: { minWidth: 0 },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: '10px',
    backgroundColor: '#dff4f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0f8d81',
    flexShrink: 0,
  },
  iconSmall: { fontSize: 18 },
  metricIcon: { fontSize: 15 },
  inlineSignalIcon: { color: '#52677f', fontSize: 16 },
  vehicleTitle: { fontSize: 16, fontWeight: 900, color: 'var(--app-text)' },
  vehicleSubtitle: { fontSize: 12, color: '#687c91', fontWeight: 600 },
  metricsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.3, mb: 1.5 },
  healthChips: { flexWrap: 'wrap', rowGap: 0.8, mb: 1.6 },
  signalSection: { mt: 'auto' },
  metricLabel: { color: '#6b7f94', fontSize: 11, mb: 0.2, fontWeight: 700 },
  signalRoot: { mt: 1 },
  signalHeader: { justifyContent: 'space-between', mb: 0.45 },
  signalLabel: { color: '#768aa2', fontSize: 12, fontWeight: 700 },
  signalValue: { color: 'var(--app-text)', fontSize: 12, fontWeight: 800 },
  signalProgress: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#dfe7ef',
    '& .MuiLinearProgress-bar': { borderRadius: 999 },
  },
  inlineSignal: { alignItems: 'center', mt: 1 },
  inlineFault: { alignItems: 'flex-start', mt: 1 },
  inlineText: { color: '#52677f', fontSize: 12, fontWeight: 700 },
  faultText: { color: '#9a3412', fontSize: 12, fontWeight: 700 },
  faultIcon: { color: '#c2410c', fontSize: 16, mt: 0.1 },
  summaryLabel: { color: '#687c91', fontSize: 12, fontWeight: 700 },
} satisfies Record<string, SxProps<Theme>>;

export function vehicleCardSx(isHighlighted: boolean, isStale: boolean): SxProps<Theme> {
  return {
    border: `1px solid ${isHighlighted ? '#f5c17a' : '#d9e3ed'}`,
    borderRadius: '12px',
    backgroundColor: isStale ? '#fffaf1' : '#ffffff',
    p: 2,
    minHeight: 286,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 22px rgba(13, 39, 66, 0.05)',
  };
}

export function statusChipSx(tone: { bg: string; border: string; text: string }): SxProps<Theme> {
  return {
    height: 26,
    flexShrink: 0,
    borderRadius: '999px',
    backgroundColor: tone.bg,
    color: tone.text,
    fontSize: 11,
    fontWeight: 800,
    border: `1px solid ${tone.border}`,
  };
}

export function metricRootSx(align: 'left' | 'right'): SxProps<Theme> {
  return { textAlign: align };
}

export function metricValueRowSx(align: 'left' | 'right'): SxProps<Theme> {
  return {
    alignItems: 'center',
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  };
}

export function metricValueSx(tone: MetricTone): SxProps<Theme> {
  const color = tone === 'critical' ? '#b42318' : tone === 'warning' ? '#b45309' : '#15253d';

  return { color, fontSize: 13, fontWeight: 800 };
}

export function progressBarSx(color: string): SxProps<Theme> {
  return {
    ...fleetStyles.signalProgress,
    '& .MuiLinearProgress-bar': {
      backgroundColor: color,
      borderRadius: 999,
    },
  };
}

export function healthChipSx(isCritical: boolean): SxProps<Theme> {
  return {
    height: 25,
    borderRadius: '999px',
    backgroundColor: isCritical ? '#fee2e2' : '#fef3c7',
    color: isCritical ? '#b42318' : '#92400e',
    border: `1px solid ${isCritical ? '#fecaca' : '#fde68a'}`,
    fontSize: 11,
    fontWeight: 800,
    '& .MuiChip-icon': {
      color: isCritical ? '#b42318' : '#92400e',
      fontSize: 15,
    },
  };
}

export function summaryCardSx(tone: FleetSummaryTone): SxProps<Theme> {
  const colors = getSummaryColors(tone);

  return {
    border: '1px solid #d9e3ed',
    borderRadius: '12px',
    backgroundColor: colors.bg,
    p: 1.7,
    borderLeft: `4px solid ${colors.accent}`,
  };
}

export function summaryValueSx(tone: FleetSummaryTone): SxProps<Theme> {
  const colors = getSummaryColors(tone);

  return { color: colors.text, fontSize: 26, fontWeight: 900 };
}

function getSummaryColors(tone: FleetSummaryTone) {
  return {
    neutral: { bg: '#ffffff', text: '#13283d', accent: '#0f8d81' },
    warning: { bg: '#fff7ed', text: '#9a3412', accent: '#f59e0b' },
    critical: { bg: '#fef2f2', text: '#991b1b', accent: '#ef4444' },
    stale: { bg: '#f8fafc', text: '#334155', accent: '#64748b' },
  }[tone];
}
