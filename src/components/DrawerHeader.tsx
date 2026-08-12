import { Box, Toolbar, Typography } from '@mui/material';

const DrawerHeader = () => (
  <Toolbar
    sx={{
      minHeight: '72px !important',
      px: 2.5,
    }}
  >
    <Box>
      <Typography color="primary" variant="h6">
        Logistics
      </Typography>

      <Typography color="text.secondary" variant="caption">
        Control Tower
      </Typography>
    </Box>
  </Toolbar>
);

export default DrawerHeader;
