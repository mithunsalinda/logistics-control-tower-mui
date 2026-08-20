import type { SxProps, Theme } from '@mui/material';

export const formControlStyles = {
  searchRoot: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    height: 38,
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
    px: 1.5,
    gap: 1,
  },
  searchIcon: {
    fontSize: 18,
    color: 'var(--app-text)',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--app-text)',
    fontSize: 14,
    '&::placeholder': { color: 'var(--app-text-muted)', opacity: 1 },
  },
  selectShell: {
    minWidth: 0,
    height: 38,
    border: '1px solid var(--app-border)',
    borderRadius: '10px',
    backgroundColor: 'var(--app-surface)',
  },
  select: {
    width: '100%',
    height: '100%',
    color: 'var(--app-text)',
    fontSize: 13,
    fontWeight: 600,
    '& .MuiSelect-select': {
      px: 1.3,
      py: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '& fieldset': { border: 'none' },
    '& .MuiSelect-icon': { right: 10, color: 'var(--app-text)' },
  },
} satisfies Record<string, SxProps<Theme>>;
