import { Paper, Typography } from '@mui/material';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        minHeight: 300,
        padding: 3,
      }}
    >
      <Typography component="h2" variant="h4">
        {title}
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {title} page content will be added here.
      </Typography>
    </Paper>
  );
};

export default PlaceholderPage;
