import { Box, Chip, CircularProgress, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import { useOutletContext } from 'react-router';

import { useGetShipmentsQuery } from '../store/shipmentsApi';
import RegionSelector from '../components/map/RegionSelector';
import OperationsMap from '../components/map/OperationsMap';
import { styled } from '@mui/material/styles';
import type { RegionCode } from '../config/regions';
import ActiveExceptions from '../components/ActiveExceptions';
import ShipmentStats from './dashboard/ShipmentStats';
import OperationsHeader from './dashboard/OperationsHeader';

interface DashboardOutletContext {
  region: RegionCode;
  onRegionChange: (region: RegionCode) => void;
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
const Dashboard = () => {
  //const { data: shipments, isLoading, isError } = useGetShipmentsQuery();
  const { region, onRegionChange } = useOutletContext<DashboardOutletContext>();

  return (
    <Stack spacing={3}>
      <Box>
        <OperationsHeader />
      </Box>

      <ShipmentStats />
      <Grid container spacing={2}>
        <Grid size={8}>
          <OperationsMap region={region} />
          <Paper
            elevation={2}
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
        </Grid>
        <Grid size={4}>
          <ActiveExceptions />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Dashboard;
