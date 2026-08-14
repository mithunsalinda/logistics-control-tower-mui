import { Grid, Stack } from '@mui/material';
import { useOutletContext } from 'react-router';
import OperationsMap from '../../components/map/OperationsMap';
import type { RegionCode } from '../../config/regions';
import ActiveExceptions from '../../components/ActiveExceptions';
import ShipmentStats from './ShipmentStats';

interface DashboardOutletContext {
  region: RegionCode;
  onRegionChange: (region: RegionCode) => void;
}

const Dashboard = () => {
  const { region } = useOutletContext<DashboardOutletContext>();

  return (
    <Stack spacing={3}>
      <ShipmentStats />
      <Grid container spacing={2}>
        <Grid size={8}>
          <OperationsMap region={region} />
        </Grid>
        <Grid size={4}>
          <ActiveExceptions />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Dashboard;
