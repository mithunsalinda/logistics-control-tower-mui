import type { SxProps, Theme } from '@mui/material';

export type CapacityTone = 'blue' | 'green' | 'red';

export const tonePalette = {
  blue: { bg: '#f2f7ff', border: '#c9daf5', main: '#4b68cf', text: '#263f98' },
  green: { bg: '#effaf5', border: '#bce6cf', main: '#2f8f6b', text: '#237155' },
  red: { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' },
};

export const capacityStyles = {
  root: { width: '100%' },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
    gap: 1.4,
  },
  horizonBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1.5,
    flexWrap: 'wrap',
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    p: 1.4,
  },
  iconRow: { alignItems: 'center' },
  iconAccent: { color: '#159d95' },
  horizonTitle: { color: 'var(--app-text)', fontSize: 15, fontWeight: 900 },
  mutedText: { color: 'var(--app-text-muted)', fontSize: 12 },
  horizonSelect: {
    height: 38,
    minWidth: 160,
    backgroundColor: 'var(--app-surface)',
    color: 'var(--app-text)',
    fontSize: 13,
    fontWeight: 800,
    '& fieldset': { borderColor: 'var(--app-border)', borderRadius: '8px' },
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)' },
    gap: 2,
    alignItems: 'start',
  },
  panel: {
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    p: 1.8,
  },
  panelHeader: { alignItems: 'center', mb: 1.5 },
  scenarioPanelHeader: { alignItems: 'center', mb: 1.4 },
  comparisonHeader: { alignItems: 'center', mb: 1.2 },
  eyebrow: { color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 },
  panelTitle: { color: 'var(--app-text)', fontSize: 21, fontWeight: 900 },
  comparisonTitle: { color: 'var(--app-text)', fontSize: 18, fontWeight: 900 },
  emptyState: {
    border: '1px solid var(--app-border)',
    borderRadius: '8px',
    p: 3,
    textAlign: 'center',
  },
  emptyText: { color: 'var(--app-text-muted)', fontSize: 13, fontWeight: 800 },
  forecastHeader: {
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', md: 'center' },
    mb: 1.2,
  },
  forecastLane: { color: 'var(--app-text)', fontSize: 15, fontWeight: 900 },
  forecastMeta: { color: 'var(--app-text-muted)', fontSize: 12, fontWeight: 700 },
  chipRow: { flexWrap: 'wrap', rowGap: 0.7 },
  barRoot: { mt: 1 },
  barHeader: { justifyContent: 'space-between', mb: 0.4 },
  barLabel: { color: '#52677f', fontSize: 11, fontWeight: 900 },
  barValue: { color: 'var(--app-text)', fontSize: 11, fontWeight: 900 },
  comparisonMetricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 0.8,
    mt: 1,
  },
  runButton: { mt: 1.5, py: 1.2, fontWeight: 900, borderRadius: '8px', backgroundColor: '#159d95' },
  miniMetric: { border: '1px solid var(--app-border)', borderRadius: '8px', p: 0.9 },
  miniMetricLabel: { color: 'var(--app-text-muted)', fontSize: 10, fontWeight: 900 },
  miniMetricValue: { color: 'var(--app-text)', fontSize: 13, fontWeight: 900, mt: 0.3 },
  metricLabel: { color: '#5d7088', fontSize: 12, fontWeight: 900 },
} satisfies Record<string, SxProps<Theme>>;

export function forecastCardSx(color: { border: string; main: string }, isShortfall: boolean): SxProps<Theme> {
  return {
    border: `1px solid ${color.border}`,
    borderLeft: `5px solid ${color.main}`,
    borderRadius: '8px',
    backgroundColor: isShortfall ? '#fff7f7' : '#f3fbf7',
    p: 1.4,
  };
}

export function capacityProgressSx(color: string): SxProps<Theme> {
  return {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e3ebf2',
    '& .MuiLinearProgress-bar': { backgroundColor: color },
  };
}

export function scenarioOptionSx(isSelected: boolean): SxProps<Theme> {
  return {
    width: '100%',
    textAlign: 'left',
    border: `1px solid ${isSelected ? '#159d95' : 'var(--app-border)'}`,
    borderRadius: '8px',
    backgroundColor: isSelected
      ? 'color-mix(in srgb, #159d95 12%, var(--app-surface))'
      : 'var(--app-surface)',
    p: 1.2,
    cursor: 'pointer',
  };
}

export function comparisonCardSx(): SxProps<Theme> {
  return { border: '1px solid var(--app-border)', borderRadius: '8px', p: 1.2 };
}

export function metricCardSx(color: { border: string; main: string; bg: string }): SxProps<Theme> {
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

export function chipSx(color: { bg: string; border: string; text: string }): SxProps<Theme> {
  return {
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontSize: 11,
    fontWeight: 900,
    height: 24,
  };
}
