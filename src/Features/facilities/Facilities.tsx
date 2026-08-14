import { Box, Stack, Card, Typography, Chip, CircularProgress } from '@mui/material';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  AccessTime as AccessTimeIcon,
  Apartment as ApartmentIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import OperationsHeader from '../dashboard/OperationsHeader';

interface Facility {
  id: string;
  code: string;
  name: string;
  status: 'Constrained' | 'Normal';
  dockUtilization: number;
  inboundQueue: number;
  outboundQueue: number;
  averageDwell: number;
  activeDoors: number;
  staffing: 'Constrained' | 'Normal';
}

const facilities: Facility[] = [
  {
    id: '1',
    code: 'FAC-05',
    name: 'Singapore Regional Hub',
    status: 'Constrained',
    dockUtilization: 84,
    inboundQueue: 18,
    outboundQueue: 16,
    averageDwell: 55,
    activeDoors: 12,
    staffing: 'Constrained',
  },
  {
    id: '2',
    code: 'FAC-06',
    name: 'Colombo Consolidation Centre',
    status: 'Normal',
    dockUtilization: 62,
    inboundQueue: 8,
    outboundQueue: 7,
    averageDwell: 31,
    activeDoors: 9,
    staffing: 'Normal',
  },
  {
    id: '3',
    code: 'FAC-07',
    name: 'Dubai Distribution Hub',
    status: 'Normal',
    dockUtilization: 71,
    inboundQueue: 12,
    outboundQueue: 10,
    averageDwell: 42,
    activeDoors: 15,
    staffing: 'Normal',
  },
  {
    id: '4',
    code: 'FAC-08',
    name: 'Mumbai Sorting Centre',
    status: 'Constrained',
    dockUtilization: 88,
    inboundQueue: 22,
    outboundQueue: 19,
    averageDwell: 67,
    activeDoors: 10,
    staffing: 'Constrained',
  },
];

const getStatusColor = (status: string) => {
  return status === 'Constrained'
    ? { bg: '#fff5e8', text: '#c57413' }
    : { bg: '#e0f7f4', text: '#2e8b8a' };
};

const getStatusLabel = (status: string) => {
  return status === 'Constrained' ? 'Constrained' : 'Normal';
};

const getCircleColor = (utilization: number) => {
  if (utilization >= 80) return '#ff6b6b';
  if (utilization >= 60) return '#ffa500';
  return '#00b8a9';
};

export default function Facilities() {
  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Facilities"
          liveUpdate={false}
          title="WAREHOUSE COORDINATION"
          desc="Dock utilisation, queues, dwell and staffing constraints."
        />
      </Box>

      {/* Facilities Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          },
          gap: 2,
        }}
      >
        {facilities.map((facility) => {
          const statusColor = getStatusColor(facility.status);
          const circleColor = getCircleColor(facility.dockUtilization);

          return (
            <Card
              key={facility.id}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                border: '1px solid #e8eef5',
                backgroundColor: '#ffffff',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
                '&:hover': {
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s ease',
                },
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#2e8b8a',
                      letterSpacing: '0.5px',
                      mb: 0.5,
                    }}
                  >
                    {facility.code}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1d2d3f',
                    }}
                  >
                    {facility.name}
                  </Typography>
                </Box>
                <Chip
                  label={getStatusLabel(facility.status)}
                  size="small"
                  sx={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                    fontWeight: 600,
                    fontSize: '12px',
                    height: '24px',
                  }}
                />
              </Box>

              {/* Content Section */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                }}
              >
                {/* Circular Progress */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    flex: '0 0 120px',
                  }}
                >
                  <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={120}
                      thickness={4}
                      sx={{
                        position: 'absolute',
                        color: '#e8eef5',
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={facility.dockUtilization}
                      size={120}
                      thickness={4}
                      sx={{
                        position: 'absolute',
                        color: circleColor,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '28px',
                          fontWeight: 700,
                          color: '#1d2d3f',
                        }}
                      >
                        {facility.dockUtilization}%
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '11px',
                          color: '#7a8a9e',
                          fontWeight: 500,
                        }}
                      >
                        Dock utilisation
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Metrics Section */}
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={1.5}>
                    {/* Inbound Queue */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <ArrowDownwardIcon
                        sx={{
                          fontSize: 20,
                          color: '#2e8b8a',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#1d2d3f',
                          }}
                        >
                          {facility.inboundQueue}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#7a8a9e',
                            fontWeight: 500,
                          }}
                        >
                          Inbound queue
                        </Typography>
                      </Box>
                    </Box>

                    {/* Outbound Queue */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <ArrowUpwardIcon
                        sx={{
                          fontSize: 20,
                          color: '#2e8b8a',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#1d2d3f',
                          }}
                        >
                          {facility.outboundQueue}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#7a8a9e',
                            fontWeight: 500,
                          }}
                        >
                          Outbound queue
                        </Typography>
                      </Box>
                    </Box>

                    {/* Average Dwell */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          fontSize: 20,
                          color: '#2e8b8a',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#1d2d3f',
                          }}
                        >
                          {facility.averageDwell} min
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#7a8a9e',
                            fontWeight: 500,
                          }}
                        >
                          Average dwell
                        </Typography>
                      </Box>
                    </Box>

                    {/* Active Doors */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <ApartmentIcon
                        sx={{
                          fontSize: 20,
                          color: '#2e8b8a',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#1d2d3f',
                          }}
                        >
                          {facility.activeDoors}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#7a8a9e',
                            fontWeight: 500,
                          }}
                        >
                          Active doors
                        </Typography>
                      </Box>
                    </Box>

                    {/* Staffing */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <GroupIcon
                        sx={{
                          fontSize: 20,
                          color: '#2e8b8a',
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#1d2d3f',
                          }}
                        >
                          {facility.staffing}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#7a8a9e',
                            fontWeight: 500,
                          }}
                        >
                          Staffing
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Stack>
  );
}
