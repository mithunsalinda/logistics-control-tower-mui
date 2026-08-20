import type { SxProps, Theme } from '@mui/material';

export const dashboardStyles = {
  root: { width: '100%' },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
  },
  title: { color: 'var(--app-text)', fontSize: 18, fontWeight: 900 },
  widgetControls: { alignItems: 'center', flexWrap: 'wrap', rowGap: 0.8 },
  widgetLabel: { color: '#52677f', fontSize: 12, fontWeight: 800 },
  gridWidget: {
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    p: 1.6,
  },
  eyebrow: { color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 },
  shipmentList: { mt: 1 },
  shipmentRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '130px 1fr 130px 100px' },
    gap: 1,
    border: '1px solid var(--app-border-soft)',
    borderRadius: '8px',
    p: 1,
  },
  shipmentId: { color: '#159d95', fontSize: 13, fontWeight: 900 },
  shipmentLane: { color: 'var(--app-text)', fontSize: 13, fontWeight: 800 },
  shipmentMeta: { color: '#52677f', fontSize: 12 },
} satisfies Record<string, SxProps<Theme>>;
