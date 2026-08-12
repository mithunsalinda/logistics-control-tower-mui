import type { ReactNode } from 'react';

import {
  ErrorOutlineRounded,
  Inventory2Outlined,
  LocalShippingOutlined,
  TrendingUpRounded,
  WarningAmberRounded,
} from '@mui/icons-material';

import { Box, Typography } from '@mui/material';

interface StatItem {
  id: number;
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}

const stats: StatItem[] = [
  {
    id: 1,
    title: 'Active shipments',
    value: '5,000',
    description: '+2.8% vs yesterday',
    icon: <Inventory2Outlined />,
  },
  {
    id: 2,
    title: 'Vehicles moving',
    value: '33',
    description: 'Across selected region',
    icon: <LocalShippingOutlined />,
  },
  {
    id: 3,
    title: 'At-risk shipments',
    value: '893',
    description: 'Requires attention',
    icon: <WarningAmberRounded />,
  },
  {
    id: 4,
    title: 'Critical exceptions',
    value: '0',
    description: 'Unresolved',
    icon: <ErrorOutlineRounded />,
  },
  {
    id: 5,
    title: 'On-time delivery',
    value: '94.7%',
    description: '+1.4 pts this week',
    icon: <TrendingUpRounded />,
  },
];

export default function ShipmentStats() {
  return (
    <Box
      sx={{
        width: '100%',

        display: 'grid',

        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(5, 1fr)',
          xl: 'repeat(5, 1fr)',
        },

        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </Box>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Box
      sx={{
        minHeight: 113,
        backgroundColor: '#ffffff',
        border: '1px solid #d7e1ec',
        borderRadius: '22px',
        px: 2.2,
        py: 2.2,
        display: 'flex',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(15, 39, 68, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          minWidth: 34,
          borderRadius: '10px',
          backgroundColor: '#e3f5f4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#08a89e',
          mr: 2.2,
          '& svg': {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            color: '#5d718e',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.4,
            mb: 0.7,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: '#061c3b',
            fontSize: {
              xs: 25,
              md: 28,
            },
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
            mb: 0.8,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            color: '#607795',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
