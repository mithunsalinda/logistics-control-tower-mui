import { useMemo, useState } from 'react';

import SearchRounded from '@mui/icons-material/SearchRounded';
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';

import {
  Box,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import OperationsHeader from '../dashboard/OperationsHeader';

type VehicleStatus = 'In Transit' | 'Delayed';

interface Vehicle {
  id: string;
  type: 'Van' | 'Truck' | 'Reefer' | 'Tractor';
  driver: string;
  status: VehicleStatus;
  speed: number;
  hoursRemaining: number;
  telemetry: string;
  utilization: number;
}

const vehicles: Vehicle[] = [
  {
    id: 'VEH-0002',
    type: 'Van',
    driver: 'A. Silva',
    status: 'In Transit',
    speed: 45,
    hoursRemaining: 10,
    telemetry: '14:15',
    utilization: 59,
  },
  {
    id: 'VEH-0005',
    type: 'Truck',
    driver: 'R. Singh',
    status: 'In Transit',
    speed: 68,
    hoursRemaining: 5.8,
    telemetry: '14:15',
    utilization: 40,
  },
  {
    id: 'VEH-0008',
    type: 'Tractor',
    driver: 'J. Novak',
    status: 'In Transit',
    speed: 93,
    hoursRemaining: 4.6,
    telemetry: '14:15',
    utilization: 52,
  },
  {
    id: 'VEH-0011',
    type: 'Reefer',
    driver: 'M. Carter',
    status: 'In Transit',
    speed: 40,
    hoursRemaining: 5.7,
    telemetry: '14:15',
    utilization: 62,
  },
  {
    id: 'VEH-0014',
    type: 'Van',
    driver: 'S. Tanaka',
    status: 'In Transit',
    speed: 66,
    hoursRemaining: 5.2,
    telemetry: '14:15',
    utilization: 47,
  },
  {
    id: 'VEH-0017',
    type: 'Truck',
    driver: 'A. Silva',
    status: 'In Transit',
    speed: 33,
    hoursRemaining: 5.3,
    telemetry: '14:15',
    utilization: 68,
  },
  {
    id: 'VEH-0019',
    type: 'Van',
    driver: 'K. Patel',
    status: 'Delayed',
    speed: 26,
    hoursRemaining: 3.4,
    telemetry: '13:55',
    utilization: 74,
  },
  {
    id: 'VEH-0022',
    type: 'Truck',
    driver: 'N. Gomez',
    status: 'Delayed',
    speed: 35,
    hoursRemaining: 2.8,
    telemetry: '13:42',
    utilization: 82,
  },
];

const statusOptions = ['All', 'In Transit', 'Delayed'] as const;

export default function FleetAndDrivers() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All');

  const filteredVehicles = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesQuery =
        query.length === 0 ||
        [vehicle.id, vehicle.type, vehicle.driver].join(' ').toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [searchText, statusFilter]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as (typeof statusOptions)[number]);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Fleet Status"
          liveUpdate={false}
          title="FLEET & DRIVER MANAGEMENT"
          desc="Live asset health, duty status and telemetry freshness."
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          border: '1px solid #d9e3ed',
          borderRadius: '12px',
          backgroundColor: '#f4f8fb',
          p: 1.2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
            height: 38,
            border: '1px solid #d5e0eb',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            px: 1.5,
            gap: 1,
          }}
        >
          <SearchRounded sx={{ fontSize: 18, color: '#2d3f53' }} />
          <Box
            component="input"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search vehicle or driver..."
            sx={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#1d2b3b',
              fontSize: 14,
              '&::placeholder': {
                color: '#6a7c92',
                opacity: 1,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: '100%', sm: 150 },
            minWidth: { xs: '100%', sm: 150 },
            height: 38,
            border: '1px solid #d5e0eb',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
          }}
        >
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            IconComponent={KeyboardArrowDownRounded}
            displayEmpty
            sx={{
              width: '100%',
              height: '100%',
              color: '#1b2b40',
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
                right: 10,
                color: '#1c2e45',
              },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {filteredVehicles.length === 0 ? (
          <Box
            sx={{
              gridColumn: '1 / -1',
              border: '1px solid #d9e3ed',
              borderRadius: '12px',
              backgroundColor: '#f9fbfd',
              py: 4,
              textAlign: 'center',
              color: '#64798f',
              fontSize: 14,
            }}
          >
            No vehicles match the current search.
          </Box>
        ) : (
          filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        )}
      </Box>
    </Stack>
  );
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

function VehicleCard({ vehicle }: VehicleCardProps) {
  const statusColor = vehicle.status === 'Delayed' ? '#f5c17a' : '#9ddcc7';
  const statusBg = vehicle.status === 'Delayed' ? '#fdf0d8' : '#dff6ef';

  return (
    <Box
      sx={{
        border: '1px solid #d9e3ed',
        borderRadius: '16px',
        backgroundColor: '#f4f8fb',
        p: 2,
        minHeight: 210,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              backgroundColor: '#dff4f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f8d81',
            }}
          >
            <LocalShippingRounded sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.04em' }}
            >
              {vehicle.id}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#687c91', fontWeight: 500 }}>
              {vehicle.type}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={vehicle.status}
          sx={{
            height: 26,
            borderRadius: '999px',
            backgroundColor: statusBg,
            color: '#0f8d81',
            fontSize: 11,
            fontWeight: 700,
            '& .MuiChip-label': {
              px: 1,
            },
            border: `1px solid ${statusColor}`,
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          mt: 1,
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ color: '#6b7f94', fontSize: 12, mb: 0.2 }}>Driver</Typography>
          <Typography sx={{ color: '#15253d', fontSize: 14, fontWeight: 600 }}>
            {vehicle.driver}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: '#6b7f94', fontSize: 12, mb: 0.2, textAlign: 'right' }}>
            Speed
          </Typography>
          <Typography sx={{ color: '#15253d', fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
            {vehicle.speed} km/h
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ color: '#6b7f94', fontSize: 12, mb: 0.2 }}>HOS remaining</Typography>
          <Typography sx={{ color: '#15253d', fontSize: 14, fontWeight: 600 }}>
            {vehicle.hoursRemaining}h
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: '#6b7f94', fontSize: 12, mb: 0.2, textAlign: 'right' }}>
            Telemetry
          </Typography>
          <Typography sx={{ color: '#15253d', fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
            {vehicle.telemetry}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: '#768aa2', fontSize: 12, fontWeight: 600 }}>
              Utilization
            </Typography>
          </Box>
          <Typography sx={{ color: '#1b2d43', fontSize: 12, fontWeight: 700 }}>
            {vehicle.utilization}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={vehicle.utilization}
          sx={{
            height: 6,
            borderRadius: 999,
            backgroundColor: '#dfe7ef',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#3eb7a9',
              borderRadius: 999,
            },
          }}
        />
      </Box>
    </Box>
  );
}
