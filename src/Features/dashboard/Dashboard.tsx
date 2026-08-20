import { Box, Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { useOutletContext } from 'react-router';
import { useEffect, useState } from 'react';
import OperationsMap from '../../components/map/OperationsMap';
import type { RegionCode } from '../../config/regions';
import ActiveExceptions from '../../components/ActiveExceptions';
import ShipmentStats from './ShipmentStats';
import { useGetShipmentsQuery } from '../../store';
import { getDataRegion } from '../../utils/regionFilters';

interface DashboardOutletContext {
  region: RegionCode;
  onRegionChange: (region: RegionCode) => void;
}

const dashboardPreferenceKey = 'logistics.dashboard.widgets';
const defaultWidgets = {
  kpis: true,
  map: true,
  exceptions: true,
  grid: true,
};

const Dashboard = () => {
  const { region } = useOutletContext<DashboardOutletContext>();
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [customizing, setCustomizing] = useState(false);
  const { data } = useGetShipmentsQuery({
    region: getDataRegion(region),
    page: 1,
    pageSize: 4,
    search: '',
    status: 'All',
    risk: 'All',
    carrier: 'All',
    groupBy: 'none',
    sort: [{ field: 'estimatedArrival', direction: 'asc' }],
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(dashboardPreferenceKey);
      if (saved) {
        setWidgets({ ...defaultWidgets, ...JSON.parse(saved) });
      }
    } catch {
      setWidgets(defaultWidgets);
    }
  }, []);

  const handleWidgetToggle = (key: keyof typeof widgets) => {
    setWidgets((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSaveDashboard = () => {
    localStorage.setItem(dashboardPreferenceKey, JSON.stringify(widgets));
    setCustomizing(false);
  };

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ color: '#10243a', fontSize: 18, fontWeight: 900 }}>
          Personalized dashboard
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.8 }}>
          {customizing &&
            Object.entries(widgets).map(([key, value]) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={value} onChange={() => handleWidgetToggle(key as keyof typeof widgets)} />}
                label={<Typography sx={{ color: '#52677f', fontSize: 12, fontWeight: 800 }}>{key}</Typography>}
              />
            ))}
          <Button size="small" variant={customizing ? 'contained' : 'outlined'} onClick={customizing ? handleSaveDashboard : () => setCustomizing(true)}>
            {customizing ? 'Save dashboard' : 'Configure widgets'}
          </Button>
        </Stack>
      </Box>

      {widgets.kpis && <ShipmentStats />}
      <Grid container spacing={2}>
        {widgets.map && (
          <Grid size={widgets.exceptions ? 8 : 12}>
            <OperationsMap region={region} variant="preview" />
          </Grid>
        )}
        {widgets.exceptions && (
          <Grid size={widgets.map ? 4 : 12}>
            <ActiveExceptions />
          </Grid>
        )}
        {widgets.grid && (
          <Grid size={12}>
            <Box sx={{ border: '1px solid #d9e3ed', borderRadius: '10px', backgroundColor: '#ffffff', p: 1.6 }}>
              <Typography sx={{ color: '#159d95', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>
                SHIPMENT GRID WIDGET
              </Typography>
              <Stack spacing={0.8} sx={{ mt: 1 }}>
                {(data?.rows ?? []).map((shipment) => (
                  <Box
                    key={shipment.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '130px 1fr 130px 100px' },
                      gap: 1,
                      border: '1px solid #edf1f6',
                      borderRadius: '8px',
                      p: 1,
                    }}
                  >
                    <Typography sx={{ color: '#159d95', fontSize: 13, fontWeight: 900 }}>{shipment.id}</Typography>
                    <Typography sx={{ color: '#10243a', fontSize: 13, fontWeight: 800 }}>
                      {shipment.origin} to {shipment.destination}
                    </Typography>
                    <Typography sx={{ color: '#52677f', fontSize: 12 }}>{shipment.status}</Typography>
                    <Typography sx={{ color: '#52677f', fontSize: 12 }}>{shipment.dynamicRisk}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default Dashboard;
