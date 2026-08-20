import { Box, Stack } from '@mui/material';
import { useOutletContext } from 'react-router';

import OperationsMap from '../../components/map/OperationsMap';
import type { RegionCode } from '../../config/regions';
import OperationsHeader from '../dashboard/OperationsHeader';

interface LiveMapOutletContext {
  region: RegionCode;
}

export default function LiveMap() {
  const { region } = useOutletContext<LiveMapOutletContext>();

  return (
    <Stack spacing={2.5} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          region={region}
          pageName="Live Map"
          liveUpdate
          title="REAL-TIME MAP & GEOSPATIAL AWARENESS"
          desc="Inspect active vehicles, shipment routes, geofences, and operational overlays."
        />
      </Box>

      <OperationsMap region={region} variant="command" />
    </Stack>
  );
}
