import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
}

const PlaceholderPage = ({ title, subtitle }: PlaceholderPageProps) => {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle ?? 'Operational snapshot and management controls for this module.'}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {[
          { label: 'Current status', value: 'Healthy', tone: 'success' },
          { label: 'Pending actions', value: '12', tone: 'warning' },
          { label: 'Open alerts', value: '4', tone: 'error' },
          { label: 'Coverage', value: '96%', tone: 'info' },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  {item.value}
                </Typography>
                <Chip
                  label={item.tone}
                  size="small"
                  color={
                    item.tone === 'success'
                      ? 'success'
                      : item.tone === 'warning'
                        ? 'warning'
                        : item.tone === 'error'
                          ? 'error'
                          : 'info'
                  }
                  sx={{ mt: 1.5 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default PlaceholderPage;
