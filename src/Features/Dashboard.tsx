import { Box, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useOutletContext } from 'react-router';

import { useGetShipmentsQuery } from '../store/shipmentsApi';
import RegionSelector from '../components/map/RegionSelector';
import OperationsMap from '../components/map/OperationsMap';

import type { RegionCode } from '../config/regions';

interface DashboardOutletContext {
  region: RegionCode;
  onRegionChange: (region: RegionCode) => void;
}

const Dashboard = () => {
  const { data: shipments, isLoading, isError } = useGetShipmentsQuery();
  const { region, onRegionChange } = useOutletContext<DashboardOutletContext>();

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Toolbar */}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Logistics Control Tower</Typography>

            <RegionSelector region={region} onChange={onRegionChange} />
          </Box>
        </Paper>

        {/* Map */}

        <Box
          sx={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
          }}
        >
          <OperationsMap region={region} />
        </Box>
      </Box>
      <Box>
        <Typography component="h2" variant="h4">
          Welcome back
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Here is your logistics overview for today.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            padding: 3,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Total Shipments
          </Typography>

          <Typography sx={{ my: 1 }} variant="h4">
            {shipments ? shipments.length : '—'}
          </Typography>

          <Typography color="text.secondary" variant="caption">
            Live shipment summary
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            padding: 3,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            In Transit
          </Typography>

          <Typography sx={{ my: 1 }} variant="h4">
            {shipments ? shipments.filter((item) => item.status === 'In Transit').length : '—'}
          </Typography>

          <Typography color="text.secondary" variant="caption">
            Currently moving
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            padding: 3,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Delivered
          </Typography>

          <Typography sx={{ my: 1 }} variant="h4">
            {shipments ? shipments.filter((item) => item.status === 'Delivered').length : '—'}
          </Typography>

          <Typography color="text.secondary" variant="caption">
            Successfully delivered
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            padding: 3,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Delayed
          </Typography>

          <Typography sx={{ my: 1 }} variant="h4">
            {shipments ? shipments.filter((item) => item.status === 'Delayed').length : '—'}
          </Typography>

          <Typography color="text.secondary" variant="caption">
            Require attention
          </Typography>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          padding: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Typography variant="h6">Recent Shipments</Typography>

        {isLoading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 160 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Unable to load shipment data.
          </Typography>
        ) : (
          <Stack
            divider={
              <Box
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
            }
            sx={{ mt: 2 }}
          >
            {shipments?.map((shipment) => (
              <Box
                key={shipment.id}
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  py: 2,
                }}
              >
                <Box>
                  <Typography>{shipment.id}</Typography>

                  <Typography color="text.secondary" variant="body2">
                    Destination: {shipment.destination}
                  </Typography>
                </Box>

                <Chip
                  color={
                    shipment.status === 'Delivered'
                      ? 'success'
                      : shipment.status === 'In Transit'
                        ? 'primary'
                        : 'warning'
                  }
                  label={shipment.status}
                  size="small"
                />
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default Dashboard;
