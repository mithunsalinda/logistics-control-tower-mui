import type { SxProps, Theme } from '@mui/material';

export const pageLoaderStyles = {
  fullPage: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: 'var(--app-bg)',
  },
  contentPage: {
    minHeight: 'calc(100vh - 96px)',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: 'var(--app-bg)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    display: 'grid',
    placeItems: 'center',
    backgroundColor: 'color-mix(in srgb, var(--app-bg) 76%, transparent)',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    minWidth: 190,
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    boxShadow: '0 18px 45px rgba(15, 35, 58, 0.12)',
    px: 3,
    py: 2.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.3,
  },
  label: {
    color: 'var(--app-text)',
    fontSize: 13,
    fontWeight: 800,
  },
} satisfies Record<string, SxProps<Theme>>;
