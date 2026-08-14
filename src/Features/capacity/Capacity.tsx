import { useState } from 'react';
import { Box, Stack, Card, Typography, Slider, Button } from '@mui/material';
import {
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Tune as TuneIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import OperationsHeader from '../dashboard/OperationsHeader';

interface Lane {
  id: string;
  origin: string;
  destination: string;
  demand: number;
  capacity: number;
  trend: number;
  direction: 'up' | 'down';
}

const lanes: Lane[] = [
  {
    id: '1',
    origin: 'Chicago',
    destination: 'Dallas',
    demand: 88,
    capacity: 72,
    trend: 16,
    direction: 'down',
  },
  {
    id: '2',
    origin: 'Rotterdam',
    destination: 'Hamburg',
    demand: 64,
    capacity: 81,
    trend: 17,
    direction: 'up',
  },
  {
    id: '3',
    origin: 'Singapore',
    destination: 'Colombo',
    demand: 91,
    capacity: 76,
    trend: 15,
    direction: 'down',
  },
  {
    id: '4',
    origin: 'Los Angeles',
    destination: 'Toronto',
    demand: 73,
    capacity: 78,
    trend: 5,
    direction: 'up',
  },
  {
    id: '5',
    origin: 'Tokyo',
    destination: 'Sydney',
    demand: 85,
    capacity: 84,
    trend: 1,
    direction: 'down',
  },
];

export default function Capacity() {
  const [capacityAdjustment, setCapacityAdjustment] = useState(10);

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Capacity Outlook"
          liveUpdate={false}
          title="FORECASTING & WHAT-IF PLANNING"
          desc="Compare demand against available lane capacity."
        />
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Left Panel: Lane Capacity Forecast */}
        <Card
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid #e8eef5',
            backgroundColor: '#ffffff',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon sx={{ color: '#2e8b8a', fontSize: 20 }} />
            <Box>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2e8b8a',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Next 7 Days
              </Typography>
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                Lane capacity forecast
              </Typography>
            </Box>
          </Box>

          {/* Lanes */}
          <Stack spacing={2.5}>
            {lanes.map((lane) => (
              <Box key={lane.id}>
                {/* Lane Name and Trend */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#1d2d3f',
                    }}
                  >
                    {lane.origin} → {lane.destination}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {lane.direction === 'down' ? (
                      <TrendingDownIcon
                        sx={{
                          color: '#ff5b7c',
                          fontSize: 16,
                        }}
                      />
                    ) : (
                      <TrendingUpIcon
                        sx={{
                          color: '#00b8a9',
                          fontSize: 16,
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: lane.direction === 'down' ? '#ff5b7c' : '#00b8a9',
                      }}
                    >
                      {lane.direction === 'down' ? '↘' : '↗'} {lane.trend}%
                    </Typography>
                  </Box>
                </Box>

                {/* Demand Bar */}
                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 20,
                        borderRadius: '4px',
                        backgroundColor: '#ffa500',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${lane.demand}%`,
                          height: '100%',
                          backgroundColor: '#ffa500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          pr: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#1d2d3f',
                          }}
                        >
                          Demand {lane.demand}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Capacity Bar */}
                <Box sx={{ mb: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 20,
                      borderRadius: '4px',
                      backgroundColor: '#00b8a9',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${lane.capacity}%`,
                        height: '100%',
                        backgroundColor: '#00b8a9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        pr: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#ffffff',
                        }}
                      >
                        Capacity {lane.capacity}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Right Panel: What-if Scenario */}
        <Card
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid #e8eef5',
            backgroundColor: '#ffffff',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon sx={{ color: '#2e8b8a', fontSize: 20 }} />
            <Box>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2e8b8a',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Simulation
              </Typography>
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                What-if scenario
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '14px',
              color: '#647b99',
              mb: 2.5,
              lineHeight: 1.6,
            }}
          >
            Reallocate additional road capacity to constrained lanes.
          </Typography>

          {/* Capacity Adjustment Section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1d2d3f',
                }}
              >
                Capacity adjustment
              </Typography>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#2e8b8a',
                }}
              >
                +{capacityAdjustment}%
              </Typography>
            </Box>

            {/* Slider */}
            <Slider
              value={capacityAdjustment}
              onChange={(_e, newValue) => setCapacityAdjustment(newValue as number)}
              min={0}
              max={50}
              step={1}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: '#2e8b8a',
                  width: 20,
                  height: 20,
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#2e8b8a',
                  height: 6,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#d4d4d4',
                  height: 6,
                },
              }}
            />
          </Box>

          {/* Metrics */}
          <Stack spacing={2} sx={{ mb: 3, flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1.5,
                borderBottom: '1px solid #e8eef5',
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#7a8a9e',
                  fontWeight: 500,
                }}
              >
                Projected OTD
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                95.5%
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1.5,
                borderBottom: '1px solid #e8eef5',
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#7a8a9e',
                  fontWeight: 500,
                }}
              >
                Estimated cost impact
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                +£18,500
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#7a8a9e',
                  fontWeight: 500,
                }}
              >
                At-risk shipments reduced
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1d2d3f',
                }}
              >
                134
              </Typography>
            </Box>
          </Stack>

          {/* Run Comparison Button */}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{
              backgroundColor: '#2e8b8a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1a5453',
              },
            }}
          >
            Run comparison
          </Button>
        </Card>
      </Box>
    </Stack>
  );
}
