import { useState } from 'react';
import { Box, Stack, Select, MenuItem, Paper, Card, Chip, Button, Typography } from '@mui/material';
import {
  Warning as WarningIcon,
  SearchRounded as SearchIcon,
  KeyboardArrowDownRounded,
} from '@mui/icons-material';
import OperationsHeader from '../dashboard/OperationsHeader';

interface Exception {
  id: string;
  title: string;
  severity: 'Low' | 'High' | 'Critical';
  status: 'New' | 'Acknowledged' | 'Resolved';
  description: string;
  exceptionCode: string;
  shipmentId: string;
  timestamp: string;
}

const mockExceptions: Exception[] = [
  {
    id: '1',
    title: 'Dwell Breach',
    severity: 'Low',
    status: 'New',
    description: 'Asset dwell time exceeded the facility threshold.',
    exceptionCode: 'EXC-0003',
    shipmentId: 'SHP-000167',
    timestamp: '14/08/2026, 09:49:36',
  },
  {
    id: '2',
    title: 'ETA Slippage',
    severity: 'Low',
    status: 'New',
    description: 'Estimated arrival has slipped beyond the committed delivery window.',
    exceptionCode: 'EXC-0006',
    shipmentId: 'SHP-000416',
    timestamp: '14/08/2026, 09:13:36',
  },
  {
    id: '3',
    title: 'Vehicle Breakdown',
    severity: 'High',
    status: 'New',
    description: 'Vehicle reported a critical mechanical fault.',
    exceptionCode: 'EXC-0009',
    shipmentId: 'SHP-000665',
    timestamp: '14/08/2026, 08:37:36',
  },
  {
    id: '4',
    title: 'Temperature Excursion',
    severity: 'Low',
    status: 'New',
    description: 'Reefer temperature is outside the configured safe range.',
    exceptionCode: 'EXC-0012',
    shipmentId: 'SHP-000914',
    timestamp: '14/08/2026, 08:01:36',
  },
];

const getSeverityColor = (
  severity: string,
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  switch (severity) {
    case 'Critical':
      return 'error';
    case 'High':
      return 'warning';
    case 'Low':
      return 'info';
    default:
      return 'default';
  }
};

const getIconColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return '#d32f2f';
    case 'High':
      return '#ff9800';
    case 'Low':
      return '#0288d1';
    default:
      return '#0288d1';
  }
};

export default function Exceptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');

  const filteredExceptions = mockExceptions.filter((exception) => {
    const matchesSearch =
      exception.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.exceptionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exception.shipmentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'Active'
        ? exception.status === 'New' || exception.status === 'Acknowledged'
        : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Exception Management"
          liveUpdate={false}
          title="REAL-TIME INCIDENT WORKFLOW"
          desc="Acknowledge, assign and resolve operational disruptions."
        />
      </Box>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          border: '1px solid #d9e3ed',
          borderRadius: '12px',
          backgroundColor: '#f2f6fa',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            p: 1.25,
            backgroundColor: '#f5f8fb',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minWidth: { xs: '100%', md: 420 },
              height: 38,
              borderRadius: '10px',
              border: '1px solid #d4e0eb',
              backgroundColor: '#ffffff',
              px: 1.5,
              gap: 1,
            }}
          >
            <SearchIcon sx={{ color: '#2c4058', fontSize: 18 }} />
            <Box
              sx={{
                width: '1px',
                height: 22,
                backgroundColor: '#d8e1eb',
              }}
            />
            <Box
              component="input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search exception or shipment..."
              sx={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 14,
                color: '#1e2d42',
                '&::placeholder': {
                  color: '#6f7f94',
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              minWidth: { xs: '100%', sm: 150 },
              height: 38,
              borderRadius: '10px',
              border: '1px solid #d4e0eb',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              IconComponent={KeyboardArrowDownRounded}
              sx={{
                width: '100%',
                height: '100%',
                color: '#1c2d40',
                fontSize: 14,
                fontWeight: 500,
                '& .MuiSelect-select': {
                  px: 1.5,
                  py: 0,
                  display: 'flex',
                  alignItems: 'center',
                },
                '& fieldset': {
                  border: 'none',
                },
                '& .MuiSelect-icon': {
                  color: '#1f2d40',
                  right: 10,
                  fontSize: 18,
                },
              }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Acknowledged">Acknowledged</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Exceptions List */}
      <Stack spacing={2} sx={{ backgroundColor: '#f5f8fb', p: 2, borderRadius: '12px' }}>
        {filteredExceptions.length > 0 ? (
          filteredExceptions.map((exception) => (
            <Card
              key={exception.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                border: '1px solid #edf1f6',
                '&:hover': {
                  backgroundColor: '#f8fbff',
                  boxShadow: 1,
                  transition: 'all 0.2s ease',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '56px',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: `${getIconColor(exception.severity)}20`,
                }}
              >
                <WarningIcon
                  sx={{
                    color: getIconColor(exception.severity),
                    fontSize: 32,
                  }}
                />
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#1d2d3f',
                      fontSize: 15,
                    }}
                  >
                    {exception.title}
                  </Typography>

                  <Chip
                    label={exception.severity}
                    size="small"
                    color={getSeverityColor(exception.severity)}
                    variant="outlined"
                  />

                  <Chip
                    label={exception.status}
                    size="small"
                    color="success"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#647b99',
                    mb: 1,
                    lineHeight: 1.5,
                    fontSize: 13,
                  }}
                >
                  {exception.description}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#7a8a9e',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  {exception.exceptionCode} · {exception.shipmentId} · {exception.timestamp}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: '100px',
                    color: '#50657c',
                    borderColor: '#d4e0eb',
                    fontWeight: 600,
                    fontSize: 12,
                    '&:hover': {
                      backgroundColor: '#f5f8fb',
                      borderColor: '#a0b4cc',
                    },
                  }}
                >
                  Acknowledge
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: '100px',
                    color: '#2e8b8a',
                    borderColor: '#2e8b8a',
                    fontWeight: 600,
                    fontSize: 12,
                    '&:hover': {
                      backgroundColor: '#e1f5f4',
                      borderColor: '#1a5453',
                    },
                  }}
                >
                  Resolve
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #edf1f6',
            }}
          >
            <Typography variant="body1" color="textSecondary">
              No exceptions found
            </Typography>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}
