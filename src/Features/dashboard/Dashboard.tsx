import { Box, Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { useOutletContext } from 'react-router';
import { useEffect, useState } from 'react';
import OperationsMap from '../../components/map/OperationsMap';
import type { RegionCode } from '../../config/regions';
import ActiveExceptions from '../../components/ActiveExceptions';
import ShipmentStats from './ShipmentStats';
import { useGetShipmentsQuery } from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import { dashboardStyles } from './Dashboard.styles';

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
    <Stack spacing={3} sx={dashboardStyles.root}>
      <Box sx={dashboardStyles.headerRow}>
        <Typography sx={dashboardStyles.title}>
          Personalized dashboard
        </Typography>
        <Stack direction="row" spacing={1} sx={dashboardStyles.widgetControls}>
          {customizing &&
            Object.entries(widgets).map(([key, value]) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={value} onChange={() => handleWidgetToggle(key as keyof typeof widgets)} />}
                label={<Typography sx={dashboardStyles.widgetLabel}>{key}</Typography>}
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
            <Box sx={dashboardStyles.gridWidget}>
              <Typography sx={dashboardStyles.eyebrow}>
                SHIPMENT GRID WIDGET
              </Typography>
              <Stack spacing={0.8} sx={dashboardStyles.shipmentList}>
                {(data?.rows ?? []).map((shipment) => (
                  <Box
                    key={shipment.id}
                    sx={dashboardStyles.shipmentRow}
                  >
                    <Typography sx={dashboardStyles.shipmentId}>{shipment.id}</Typography>
                    <Typography sx={dashboardStyles.shipmentLane}>
                      {shipment.origin} to {shipment.destination}
                    </Typography>
                    <Typography sx={dashboardStyles.shipmentMeta}>{shipment.status}</Typography>
                    <Typography sx={dashboardStyles.shipmentMeta}>{shipment.dynamicRisk}</Typography>
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
