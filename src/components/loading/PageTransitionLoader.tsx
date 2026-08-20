import { Fade } from '@mui/material';

import PageLoader from './PageLoader';

interface PageTransitionLoaderProps {
  loading: boolean;
}

export default function PageTransitionLoader({ loading }: PageTransitionLoaderProps) {
  return (
    <Fade in={loading} mountOnEnter unmountOnExit timeout={160}>
      <div>
        <PageLoader label="Loading page..." variant="overlay" />
      </div>
    </Fade>
  );
}
