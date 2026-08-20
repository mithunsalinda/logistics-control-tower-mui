import type { SxProps, Theme } from '@mui/material';

export const facilityStyles = {
  root: { width: '100%' },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
    gap: 1.4,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', xl: '380px minmax(0, 1fr)' },
    gap: 2,
    alignItems: 'start',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(360px, 0.9fr)' },
    gap: 2,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    px: 1.3,
    gap: 1,
  },
  searchIcon: { color: '#334a63', fontSize: 18 },
  searchInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--app-text)',
    fontSize: 13,
  },
  listHeader: { justifyContent: 'space-between', gap: 1 },
  facilityCode: { color: '#159d95', fontSize: 11, fontWeight: 900 },
  facilityName: { color: 'var(--app-text)', fontSize: 15, fontWeight: 900 },
  chipWrap: { mt: 1, flexWrap: 'wrap', rowGap: 0.7 },
  dashboardPanel: {
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    p: 1.8,
  },
  dashboardHeader: {
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', lg: 'center' },
  },
  identityRow: { alignItems: 'center' },
  progressWrap: { position: 'relative', width: 118, height: 118, flex: '0 0 auto' },
  progressTrack: { color: '#e8eef5', position: 'absolute' },
  progressValue: { position: 'absolute' },
  progressCenter: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
  },
  utilizationValue: { color: 'var(--app-text)', fontSize: 27, fontWeight: 900 },
  utilizationLabel: { color: 'var(--app-text-muted)', fontSize: 10, fontWeight: 800 },
  eyebrow: { color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 },
  dashboardTitle: { color: 'var(--app-text)', fontSize: 25, fontWeight: 900 },
  dashboardChips: { mt: 1, flexWrap: 'wrap', rowGap: 0.8 },
  dashboardMetricGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 120px)' },
    gap: 1,
    width: { xs: '100%', lg: 'auto' },
  },
  panelHeader: { alignItems: 'center', mb: 1.3 },
  eventIcon: { color: '#d66b29' },
  accentIcon: { color: '#159d95' },
  panelTitle: { color: 'var(--app-text)', fontSize: 19, fontWeight: 900 },
  emptyText: { color: 'var(--app-text-muted)', fontSize: 13 },
  eventCard: { border: '1px solid var(--app-border)', borderRadius: '8px', p: 1.2 },
  eventHeader: { justifyContent: 'space-between', gap: 1, mb: 0.8 },
  itemHeader: { justifyContent: 'space-between', gap: 1 },
  itemTitle: { color: 'var(--app-text)', fontSize: 14, fontWeight: 900 },
  itemMeta: { color: 'var(--app-text-muted)', fontSize: 11, fontWeight: 800 },
  itemDescription: { color: '#52677f', fontSize: 12, lineHeight: 1.45 },
  itemChips: { flexWrap: 'wrap', rowGap: 0.7, mt: 1 },
  divider: { my: 1 },
  appointmentFooter: { justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 0.7 },
  correlationGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
    gap: 1,
  },
  correlationDescription: { color: 'var(--app-text-muted)', fontSize: 12, mt: 1.2 },
  smallMetric: {
    border: '1px solid var(--app-border)',
    borderRadius: '8px',
    p: 1,
    backgroundColor: 'var(--app-surface-soft)',
  },
  smallMetricHeader: { color: 'var(--app-text-muted)', alignItems: 'center' },
  smallMetricLabel: { color: 'var(--app-text-muted)', fontSize: 10, fontWeight: 900 },
  smallMetricValue: { color: 'var(--app-text)', fontSize: 18, fontWeight: 900, mt: 0.4 },
  inlineSignal: { alignItems: 'center', color: '#52677f' },
  inlineSignalText: { color: '#52677f', fontSize: 12, fontWeight: 800 },
  emptyState: {
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    p: 4,
    textAlign: 'center',
  },
  emptyIcon: { color: '#9fb0c1', fontSize: 34 },
  emptyTitle: { color: 'var(--app-text)', fontSize: 19, fontWeight: 900, mt: 1 },
  emptyDescription: { color: 'var(--app-text-muted)', fontSize: 13, mt: 0.5 },
  metricLabel: { color: '#5d7088', fontSize: 12, fontWeight: 900 },
} satisfies Record<string, SxProps<Theme>>;

export function facilityButtonSx(
  isSelected: boolean,
  statusColor: { main: string },
): SxProps<Theme> {
  return {
    width: '100%',
    textAlign: 'left',
    border: `1px solid ${isSelected ? '#159d95' : 'var(--app-border)'}`,
    borderLeft: `5px solid ${statusColor.main}`,
    borderRadius: '8px',
    backgroundColor: isSelected
      ? 'color-mix(in srgb, #159d95 12%, var(--app-surface))'
      : 'var(--app-surface)',
    p: 1.4,
    cursor: 'pointer',
  };
}

export function progressValueSx(color: string): SxProps<Theme> {
  return { ...facilityStyles.progressValue, color };
}

export function metricCardSx(color: { bg: string; border: string; main: string }): SxProps<Theme> {
  return {
    border: `1px solid ${color.border}`,
    borderLeft: `4px solid ${color.main}`,
    borderRadius: '8px',
    backgroundColor: color.bg,
    p: 1.5,
  };
}

export function metricValueSx(color: { text: string }): SxProps<Theme> {
  return { color: color.text, fontSize: 26, fontWeight: 900 };
}

export const panelSx = {
  border: '1px solid var(--app-border)',
  borderRadius: '10px',
  backgroundColor: 'var(--app-surface)',
  p: 1.8,
} satisfies SxProps<Theme>;
