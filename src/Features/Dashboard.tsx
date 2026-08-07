import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

interface DashboardCard {
  title: string;
  value: string;
  description: string;
}

const dashboardCards: DashboardCard[] = [
  {
    title: 'Total Shipments',
    value: '1,248',
    description: '12% increase this month',
  },
  {
    title: 'In Transit',
    value: '86',
    description: 'Currently moving',
  },
  {
    title: 'Delivered',
    value: '1,105',
    description: 'Successfully delivered',
  },
  {
    title: 'Delayed',
    value: '14',
    description: 'Require attention',
  },
];

const recentShipments = [
  {
    id: 'SHP-1001',
    destination: 'Colombo',
    status: 'In Transit',
  },
  {
    id: 'SHP-1002',
    destination: 'Kandy',
    status: 'Delivered',
  },
  {
    id: 'SHP-1003',
    destination: 'Galle',
    status: 'Pending',
  },
];

const Dashboard = () => {
  return (
    <Stack spacing={3}>
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
        {dashboardCards.map((card) => (
          <Paper
            elevation={0}
            key={card.title}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              padding: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {card.title}
            </Typography>

            <Typography sx={{ my: 1 }} variant="h4">
              {card.value}
            </Typography>

            <Typography color="text.secondary" variant="caption">
              {card.description}
            </Typography>
          </Paper>
        ))}
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
          {recentShipments.map((shipment) => (
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
      </Paper>
    </Stack>
  );
};

export default Dashboard;
