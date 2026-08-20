import type { ReactNode } from 'react';

import {
  AccessTimeOutlined,
  LocalShippingOutlined,
  MonitorHeartOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

import { Box, Typography } from '@mui/material';

interface FleetStat {
  id: number;
  value: number;
  label: string;
  icon: ReactNode;
}

const fleetStats: FleetStat[] = [
  {
    id: 1,
    value: 33,
    label: 'In transit',
    icon: <LocalShippingOutlined />,
  },
  {
    id: 2,
    value: 8,
    label: 'HOS warnings',
    icon: <AccessTimeOutlined />,
  },
  {
    id: 3,
    value: 2,
    label: 'Maintenance',
    icon: <WarningAmberOutlined />,
  },
  {
    id: 4,
    value: 2,
    label: 'Offline',
    icon: <MonitorHeartOutlined />,
  },
];

export default function FleetStatus() {
  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#f4f8fc',
        px: {
          xs: 2,
          sm: 3,
        },
        py: 4,
      }}
    >
      <Typography
        sx={{
          color: '#009f9a',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '2.3px',
          textTransform: 'uppercase',
          mb: 1.3,
        }}
      >
        Fleet & Driver Management
      </Typography>

      <Typography
        component="h2"
        sx={{
          color: '#071d3a',
          fontSize: {
            xs: 34,
            sm: 40,
            md: 46,
          },
          fontWeight: 600,
          letterSpacing: '-1px',
          lineHeight: 1.15,
          mb: 1.2,
        }}
      >
        Fleet Status
      </Typography>

      <Typography
        sx={{
          color: '#627896',
          fontSize: {
            xs: 16,
            md: 21,
          },
          fontWeight: 400,
          mb: 3.5,
        }}
      >
        Live asset health, duty status and telemetry freshness.
      </Typography>

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },

          gap: 2,
        }}
      >
        {fleetStats.map((item) => (
          <FleetStatCard key={item.id} value={item.value} label={item.label} icon={item.icon} />
        ))}
      </Box>
    </Box>
  );
}

interface FleetStatCardProps {
  value: number;
  label: string;
  icon: ReactNode;
}

function FleetStatCard({ value, label, icon }: FleetStatCardProps) {
  return (
    <Box
      sx={{
        minHeight: 96,

        backgroundColor: '#ffffff',

        border: '1px solid #d9e3ed',
        borderRadius: '22px',

        px: 2.7,
        py: 2.2,

        boxSizing: 'border-box',

        display: 'flex',
        alignItems: 'center',

        transition: 'all 0.2s ease',

        '&:hover': {
          borderColor: '#b7c9db',
          boxShadow: '0 8px 24px rgba(13, 39, 66, 0.06)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          width: 46,
          minWidth: 46,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          color: '#00a79d',

          mr: 1.7,

          '& svg': {
            fontSize: 31,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: '#061d3c',
            fontSize: 29,
            fontWeight: 700,
            lineHeight: 1,
            mb: 0.5,
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            color: '#607694',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
