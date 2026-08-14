import type { SxProps, Theme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.35;
  }

  50% {
    transform: scale(1.4);
    opacity: 1;
  }

  100% {
    transform: scale(0.8);
    opacity: 0.35;
  }
`;

export const loginStyles = {
  root: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      lg: '1.35fr .75fr',
    },
    bgcolor: '#01244f',
  },

  heroSection: {
    minHeight: {
      xs: 320,
      lg: '100vh',
    },

    position: 'relative',
    overflow: 'hidden',

    p: {
      xs: 3,
      md: 5,
    },

    color: '#eff8ff',
  },

  logoContainer: {
    alignItems: 'center',
  },

  logoText: {
    fontWeight: 900,
    letterSpacing: '0.12em',
  },

  heroContent: {
    position: {
      xs: 'relative',
      lg: 'absolute',
    },

    left: {
      lg: '9%',
    },

    top: {
      lg: '34%',
    },

    mt: {
      xs: 8,
      lg: 0,
    },

    maxWidth: 720,
    zIndex: 2,
  },

  eyebrow: {
    fontWeight: 900,
    letterSpacing: '0.16em',
  },

  title: {
    fontSize: {
      xs: '3rem',
      md: '5rem',
      xl: '6.5rem',
    },

    lineHeight: 0.95,
    fontWeight: 900,
    letterSpacing: '-0.065em',
    mt: 1.5,
    whiteSpace: 'pre-line',
  },

  description: {
    maxWidth: 520,
    mt: 3,
    color: 'rgba(232,244,255,.68)',
    fontSize: '1.05rem',
    lineHeight: 1.65,
  },

  formSection: {
    display: 'grid',
    placeItems: 'center',

    p: {
      xs: 2.5,
      md: 4,
    },
  },

  card: {
    width: '100%',
    maxWidth: 430,
  },

  cardContent: {
    p: {
      xs: 3,
      md: 4,
    },

    '&:last-child': {
      pb: {
        xs: 3,
        md: 4,
      },
    },
  },

  cardHeader: {
    mb: 1,
    alignItems: 'center',
  },

  avatar: {
    bgcolor: 'action.selected',
    color: 'primary.main',
  },

  signInTitle: {
    fontSize: '1.65rem',
  },
} satisfies Record<string, SxProps<Theme>>;

export const getLocationDotStyle = (index: number): SxProps<Theme> => ({
  position: 'absolute',
  left: `${(index * 41) % 92}%`,
  top: `${(index * 29) % 82}%`,
  width: 7,
  height: 7,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  boxShadow: '0 0 14px rgba(33, 150, 243, 0.8)',
  animation: `${pulse} ${2.5 + (index % 4) * 0.5}s ease-in-out infinite`,
  animationDelay: `${index * 0.12}s`,
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: -5,
    borderRadius: '50%',
    border: '1px solid',
    borderColor: 'primary.main',
    opacity: 0.15,
  },
});
