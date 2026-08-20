import { Box, CircularProgress, Typography } from '@mui/material';

import { pageLoaderStyles } from './PageLoader.styles';

type PageLoaderVariant = 'content' | 'full' | 'overlay';

interface PageLoaderProps {
  label?: string;
  variant?: PageLoaderVariant;
}

const variantStyles = {
  content: pageLoaderStyles.contentPage,
  full: pageLoaderStyles.fullPage,
  overlay: pageLoaderStyles.overlay,
};

export default function PageLoader({ label = 'Loading page...', variant = 'content' }: PageLoaderProps) {
  return (
    <Box sx={variantStyles[variant]} role="status" aria-live="polite" aria-label={label}>
      <Box sx={pageLoaderStyles.panel}>
        <CircularProgress size={30} thickness={4} />
        <Typography sx={pageLoaderStyles.label}>{label}</Typography>
      </Box>
    </Box>
  );
}
