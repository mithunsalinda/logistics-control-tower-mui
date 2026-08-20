import type { SxProps, Theme } from '@mui/material';

export const exceptionStyles = {
  root: { width: '100%' },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
    gap: 2,
    alignItems: 'start',
  },
  queueList: { backgroundColor: 'var(--app-surface-soft)', p: 1.5, borderRadius: '10px' },
  emptyPaper: { p: 3, textAlign: 'center', border: '1px solid var(--app-border-soft)' },
  criticalBanner: {
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
  },
  criticalBannerRow: { alignItems: 'center' },
  criticalIcon: { color: '#d32f2f' },
  criticalTitle: { color: '#8f1d1d', fontSize: 14, fontWeight: 900 },
  criticalDescription: { color: '#9a4d4d', fontSize: 12 },
  toast: {
    position: 'fixed',
    top: 92,
    right: 24,
    zIndex: (theme) => theme.zIndex.snackbar,
    width: { xs: 'calc(100% - 32px)', sm: 360 },
    borderRadius: '8px',
    backgroundColor: 'var(--app-surface)',
    boxShadow: '0 18px 38px rgba(25, 43, 62, 0.18)',
    p: 1.4,
  },
  toastRow: { alignItems: 'flex-start' },
  toastContent: { flex: 1, minWidth: 0 },
  toastTitle: { color: 'var(--app-text)', fontSize: 13, fontWeight: 900 },
  toastDescription: { color: '#52677f', fontSize: 12, mt: 0.4 },
  toolbar: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, 1fr) 190px' },
    gap: 1,
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface-soft)',
    p: 1,
  },
  searchShell: {
    display: 'flex',
    alignItems: 'center',
    height: 38,
    borderRadius: '8px',
    border: '1px solid var(--app-border)',
    backgroundColor: 'var(--app-surface)',
    px: 1.3,
    gap: 1,
  },
  searchIcon: { color: '#2c4058', fontSize: 18 },
  searchInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    color: 'var(--app-text)',
  },
  statusSelect: {
    height: 38,
    backgroundColor: 'var(--app-surface)',
    color: 'var(--app-text)',
    fontSize: 13,
    fontWeight: 800,
    '& fieldset': { borderColor: 'var(--app-border)', borderRadius: '8px' },
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
    gap: 1,
  },
  metricLabel: { color: '#5d7088', fontSize: 11, fontWeight: 900 },
  cardIconTile: {
    width: 52,
    height: 52,
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
  },
  cardContent: { minWidth: 0 },
  cardHeader: { alignItems: 'center', flexWrap: 'wrap', rowGap: 0.8 },
  cardTitle: { color: 'var(--app-text)', fontSize: 16, fontWeight: 900 },
  cardDescription: { color: '#647b99', fontSize: 13, lineHeight: 1.5, mt: 1 },
  cardMeta: { color: 'var(--app-text-soft)', fontSize: 11, fontWeight: 700, mt: 1 },
  assigneeRow: { alignItems: 'center' },
  assigneeIcon: { color: '#5d7088', fontSize: 18 },
  actionRow: { flexWrap: 'wrap', rowGap: 0.8 },
  rulesPanel: {
    position: { lg: 'sticky' },
    top: { lg: 96 },
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    p: 1.8,
  },
  rulesHeader: { alignItems: 'center', mb: 1.5 },
  accentIcon: { color: '#159d95' },
  rulesTitle: { color: 'var(--app-text)', fontSize: 16, fontWeight: 900 },
  rulesDescription: { color: 'var(--app-text-muted)', fontSize: 12 },
  subscriptionBox: {
    border: '1px solid var(--app-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--app-surface-soft)',
    p: 1.2,
    mt: 1.6,
  },
  subscriptionRow: { alignItems: 'center' },
  ruleIcon: { color: '#53677f', fontSize: 18 },
  subscriptionTitle: { color: '#334a63', fontSize: 12, fontWeight: 900 },
  subscriptionText: { color: 'var(--app-text-muted)', fontSize: 12, mt: 0.8 },
  ruleInputHeader: { justifyContent: 'space-between', alignItems: 'center', mb: 0.6 },
  ruleLabel: { color: '#334a63', fontSize: 12, fontWeight: 900 },
  ruleValue: { color: '#159d95', fontSize: 12, fontWeight: 900 },
  ruleTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: 'var(--app-surface)',
    },
  },
  ruleProgress: {
    height: 5,
    borderRadius: 999,
    mt: 0.8,
    backgroundColor: '#e3ebf2',
    '& .MuiLinearProgress-bar': { backgroundColor: '#159d95' },
  },
} satisfies Record<string, SxProps<Theme>>;

export function toastSx(color: { border: string; main: string }): SxProps<Theme> {
  return {
    ...exceptionStyles.toast,
    border: `1px solid ${color.border}`,
    borderLeft: `5px solid ${color.main}`,
  };
}

export function warningIconSx(color: string): SxProps<Theme> {
  return { color, mt: 0.2 };
}

export function metricCardSx(color: { bg: string; border: string; main: string }): SxProps<Theme> {
  return {
    border: `1px solid ${color.border}`,
    borderLeft: `4px solid ${color.main}`,
    borderRadius: '8px',
    backgroundColor: color.bg,
    p: 1.4,
  };
}

export function metricValueSx(color: { text: string }): SxProps<Theme> {
  return { color: color.text, fontSize: 26, fontWeight: 900 };
}

export function exceptionCardSx(
  exception: { severity: string; status: string },
  severityColor: { main: string },
): SxProps<Theme> {
  return {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', xl: '64px minmax(0, 1fr) 330px' },
    gap: 1.5,
    alignItems: 'start',
    border: `1px solid ${
      exception.severity === 'Critical' && exception.status !== 'Acknowledged'
        ? '#ffb5b5'
        : 'var(--app-border-soft)'
    }`,
    borderLeft: `5px solid ${severityColor.main}`,
    borderRadius: '8px',
    backgroundColor: 'var(--app-surface)',
    p: 1.5,
    boxShadow:
      exception.severity === 'Critical' && exception.status === 'New'
        ? '0 10px 28px rgba(211, 47, 47, 0.12)'
        : 'none',
  };
}

export function cardIconTileSx(color: { bg: string; main: string }): SxProps<Theme> {
  return {
    ...exceptionStyles.cardIconTile,
    backgroundColor: color.bg,
    color: color.main,
  };
}

export const assigneeSelectSx = {
  height: 36,
  flex: 1,
  backgroundColor: 'var(--app-surface)',
  fontSize: 13,
  fontWeight: 800,
  '& fieldset': { borderColor: 'var(--app-border)', borderRadius: '8px' },
} satisfies SxProps<Theme>;
