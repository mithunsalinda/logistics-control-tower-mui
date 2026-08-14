import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

import SearchRounded from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  Box,
  Checkbox,
  Chip,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import OperationsHeader from '../dashboard/OperationsHeader';

type ShipmentStatus = 'In Transit' | 'Delayed' | 'Delivered' | 'At Dock';
type RiskLevel = 'Low' | 'Medium' | 'High';

interface Shipment {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  eta: string;
  risk: RiskLevel;
}

const shipments: Shipment[] = [
  {
    id: 'SHP-00002',
    reference: 'REF-20260001',
    origin: 'Dallas',
    destination: 'Paris',
    carrier: 'BlueLine Logistics',
    status: 'In Transit',
    eta: '13/08/2026 11:17',
    risk: 'Medium',
  },
  {
    id: 'SHP-00003',
    reference: 'REF-20260002',
    origin: 'Atlanta',
    destination: 'Colombo',
    carrier: 'Atlas Cargo',
    status: 'In Transit',
    eta: '13/08/2026 12:17',
    risk: 'Medium',
  },
  {
    id: 'SHP-00004',
    reference: 'REF-20260003',
    origin: 'Los Angeles',
    destination: 'Chicago',
    carrier: 'SwiftHaul',
    status: 'In Transit',
    eta: '13/08/2026 13:17',
    risk: 'Low',
  },
  {
    id: 'SHP-00005',
    reference: 'REF-20260004',
    origin: 'Toronto',
    destination: 'Los Angeles',
    carrier: 'OceanBridge',
    status: 'Delayed',
    eta: '13/08/2026 14:17',
    risk: 'High',
  },
  {
    id: 'SHP-00006',
    reference: 'REF-20260005',
    origin: 'Rotterdam',
    destination: 'Hamburg',
    carrier: 'NorthStar Freight',
    status: 'In Transit',
    eta: '13/08/2026 15:17',
    risk: 'Low',
  },
  {
    id: 'SHP-00007',
    reference: 'REF-20260006',
    origin: 'Hamburg',
    destination: 'Singapore',
    carrier: 'BlueLine Logistics',
    status: 'At Dock',
    eta: '13/08/2026 16:17',
    risk: 'Low',
  },
  {
    id: 'SHP-00008',
    reference: 'REF-20260007',
    origin: 'Munich',
    destination: 'Lisbon',
    carrier: 'JetStream Cargo',
    status: 'Delivered',
    eta: '14/08/2026 09:20',
    risk: 'Low',
  },
  {
    id: 'SHP-00009',
    reference: 'REF-20260008',
    origin: 'Frankfurt',
    destination: 'Prague',
    carrier: 'Apex Transit',
    status: 'Delayed',
    eta: '14/08/2026 11:00',
    risk: 'Medium',
  },
  {
    id: 'SHP-00010',
    reference: 'REF-20260009',
    origin: 'Seattle',
    destination: 'Vancouver',
    carrier: 'NorthStar Freight',
    status: 'In Transit',
    eta: '14/08/2026 08:40',
    risk: 'Medium',
  },
  {
    id: 'SHP-00011',
    reference: 'REF-20260010',
    origin: 'Chicago',
    destination: 'Denver',
    carrier: 'Atlas Cargo',
    status: 'At Dock',
    eta: '14/08/2026 12:40',
    risk: 'Low',
  },
  {
    id: 'SHP-00012',
    reference: 'REF-20260011',
    origin: 'Boston',
    destination: 'Miami',
    carrier: 'SwiftHaul',
    status: 'In Transit',
    eta: '14/08/2026 18:15',
    risk: 'High',
  },
  {
    id: 'SHP-00013',
    reference: 'REF-20260012',
    origin: 'Cairo',
    destination: 'Dubai',
    carrier: 'BlueLine Logistics',
    status: 'Delivered',
    eta: '15/08/2026 07:00',
    risk: 'Low',
  },
  {
    id: 'SHP-00014',
    reference: 'REF-20260013',
    origin: 'Singapore',
    destination: 'Bangkok',
    carrier: 'OceanBridge',
    status: 'In Transit',
    eta: '15/08/2026 10:30',
    risk: 'Medium',
  },
  {
    id: 'SHP-00015',
    reference: 'REF-20260014',
    origin: 'Madrid',
    destination: 'Rome',
    carrier: 'JetStream Cargo',
    status: 'Delayed',
    eta: '15/08/2026 13:55',
    risk: 'High',
  },
  {
    id: 'SHP-00016',
    reference: 'REF-20260015',
    origin: 'Oslo',
    destination: 'Stockholm',
    carrier: 'Apex Transit',
    status: 'In Transit',
    eta: '15/08/2026 16:00',
    risk: 'Low',
  },
];

const statusOptions = ['All', 'In Transit', 'Delayed', 'Delivered', 'At Dock'] as const;
const riskOptions = ['All', 'Low', 'Medium', 'High'] as const;
const rowsPerPage = 5;

const getStatusColor = (status: ShipmentStatus) => {
  switch (status) {
    case 'In Transit':
      return {
        bg: '#dff7ec',
        text: '#2f8f6b',
      };
    case 'Delayed':
      return {
        bg: '#fff0dc',
        text: '#c57413',
      };
    case 'Delivered':
      return {
        bg: '#daf3ff',
        text: '#1079b3',
      };
    case 'At Dock':
      return {
        bg: '#e9ebff',
        text: '#5162d5',
      };
    default:
      return {
        bg: '#e5f4f2',
        text: '#2b847a',
      };
  }
};

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'Low':
      return {
        bg: '#e6f4ea',
        text: '#3d8d61',
      };
    case 'Medium':
      return {
        bg: '#e7ebff',
        text: '#4b5bc9',
      };
    case 'High':
      return {
        bg: '#ffe8d6',
        text: '#d66b29',
      };
    default:
      return {
        bg: '#f2f4f8',
        text: '#5f6978',
      };
  }
};

export default function Shipments() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All');
  const [riskFilter, setRiskFilter] = useState<(typeof riskOptions)[number]>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchText, statusFilter, riskFilter]);

  const filteredShipments = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesSearch =
        query.length === 0 ||
        [shipment.id, shipment.reference, shipment.origin, shipment.destination, shipment.carrier]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
      const matchesRisk = riskFilter === 'All' || shipment.risk === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [searchText, statusFilter, riskFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as (typeof statusOptions)[number]);
  };

  const handleRiskChange = (event: SelectChangeEvent) => {
    setRiskFilter(event.target.value as (typeof riskOptions)[number]);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Shipments"
          liveUpdate={false}
          title="ORDER & SHIPMENT MANAGEMENT"
          desc="Search, filter and inspect the active shipment network."
        />
      </Box>

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
            <SearchRounded sx={{ color: '#2c4058', fontSize: 18 }} />
            <Box
              sx={{
                width: '1px',
                height: 22,
                backgroundColor: '#d8e1eb',
              }}
            />
            <Box
              component="input"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search reference, customer, origin..."
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
              onChange={handleStatusChange}
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
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
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
              value={riskFilter}
              onChange={handleRiskChange}
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
              {riskOptions.map((risk) => (
                <MenuItem key={risk} value={risk}>
                  {risk}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <TableContainer sx={{ backgroundColor: '#f5f8fb' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#e9f0f5',
                  '& th': {
                    color: '#63758c',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid #dfe7f0',
                  },
                }}
              >
                <TableCell padding="checkbox" sx={{ width: 50 }}>
                  <Checkbox
                    sx={{
                      color: '#cad5df',
                      '&.Mui-checked': {
                        color: '#2e8b8a',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>Shipment</TableCell>
                <TableCell>Lane</TableCell>
                <TableCell>Carrier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>Risk</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 5, textAlign: 'center', color: '#617691' }}>
                    No shipments match your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedShipments.map((shipment) => {
                  const statusColor = getStatusColor(shipment.status);
                  const riskColor = getRiskColor(shipment.risk);

                  return (
                    <TableRow
                      key={shipment.id}
                      sx={{
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f8fbff',
                        },
                        '& td': {
                          borderBottom: '1px solid #edf1f6',
                          px: 1.5,
                          py: 1.5,
                          verticalAlign: 'middle',
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{
                            color: '#d7dfeb',
                            '&.Mui-checked': {
                              color: '#2e8b8a',
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            color: '#1a8d8d',
                            fontSize: 15,
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {shipment.id}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#7a8a9e',
                            fontSize: 10,
                            fontWeight: 500,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {shipment.reference}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            color: '#1d2d3f',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {shipment.origin}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#647b99',
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        >
                          to {shipment.destination}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ color: '#2b3d54', fontSize: 13, fontWeight: 500 }}>
                          {shipment.carrier}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={shipment.status}
                          sx={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            fontWeight: 700,
                            fontSize: 11,
                            borderRadius: '999px',
                            height: 24,
                            px: 0.8,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            color: '#1b2538',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {shipment.eta.split(' ')[0]}
                        </Typography>
                        <Typography sx={{ color: '#647b99', fontSize: 10 }}>
                          {shipment.eta.split(' ').slice(1).join(' ')}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={shipment.risk}
                          sx={{
                            backgroundColor: riskColor.bg,
                            color: riskColor.text,
                            fontWeight: 700,
                            fontSize: 11,
                            borderRadius: '999px',
                            height: 24,
                            px: 0.8,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            px: 2,
            py: 2,
            backgroundColor: '#f6f9fc',
            borderTop: '1px solid #e2eaf1',
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage - 1}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#50657c',
                fontWeight: 600,
              },
              '& .Mui-selected': {
                backgroundColor: '#eaf3f9 !important',
                color: '#0d3a5d !important',
              },
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
