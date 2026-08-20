import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useOutletContext } from 'react-router';

import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControlLabel,
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

import type { RegionCode } from '../../config/regions';
import {
  useGetShipmentsQuery,
  useRecordAuditEventMutation,
  useAppSelector,
  type RiskLevel,
  type Shipment,
  type ShipmentGroupBy,
  type ShipmentSort,
  type ShipmentSortField,
  type ShipmentStatus,
} from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import { ConfirmDialog } from '../../components';
import OperationsHeader from '../dashboard/OperationsHeader';

const statusOptions = ['All', 'In Transit', 'Delayed', 'Delivered', 'At Dock'] as const;
const riskOptions = ['All', 'Low', 'Medium', 'High'] as const;
const groupOptions: Array<{ label: string; value: ShipmentGroupBy }> = [
  { label: 'No grouping', value: 'none' },
  { label: 'Group by status', value: 'status' },
  { label: 'Group by risk', value: 'risk' },
  { label: 'Group by carrier', value: 'carrier' },
];
const rowsPerPage = 5;
const visibleColumnStorageKey = 'logistics.shipments.visibleColumns';

const columns = [
  { id: 'shipment', label: 'Shipment' },
  { id: 'lane', label: 'Lane' },
  { id: 'carrier', label: 'Carrier' },
  { id: 'status', label: 'Status' },
  { id: 'arrival', label: 'Planned / estimated' },
  { id: 'risk', label: 'Risk' },
  { id: 'orders', label: 'Orders' },
] as const;

type ColumnId = (typeof columns)[number]['id'];

const defaultVisibleColumns: Record<ColumnId, boolean> = {
  shipment: true,
  lane: true,
  carrier: true,
  status: true,
  arrival: true,
  risk: true,
  orders: true,
};

export default function Shipments() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const user = useAppSelector((state) => state.auth.user);
  const selectedDataRegion = getDataRegion(region);
  const [recordAuditEvent] = useRecordAuditEventMutation();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All');
  const [riskFilter, setRiskFilter] = useState<(typeof riskOptions)[number]>('All');
  const [carrierFilter, setCarrierFilter] = useState('All');
  const [groupBy, setGroupBy] = useState<ShipmentGroupBy>('none');
  const [page, setPage] = useState(1);
  const [sortModel, setSortModel] = useState<ShipmentSort[]>([
    { field: 'estimatedArrival', direction: 'asc' },
    { field: 'risk', direction: 'desc' },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [auditMessage, setAuditMessage] = useState('');
  const [pendingBulkAction, setPendingBulkAction] = useState<'flag' | 'reassign' | 'notify' | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnId, boolean>>(
    getPersistedColumns,
  );

  const { data, isFetching } = useGetShipmentsQuery({
    region: selectedDataRegion,
    search: searchText,
    status: statusFilter,
    risk: riskFilter,
    carrier: carrierFilter,
    page,
    pageSize: rowsPerPage,
    sort: sortModel,
    groupBy,
  });

  const rows = data?.rows ?? [];
  const totalPages = data?.totalPages ?? 1;
  const carrierOptions = ['All', ...(data?.facets.carriers ?? [])];
  const groupedRows = useMemo(() => groupRows(rows, groupBy), [rows, groupBy]);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [selectedDataRegion, searchText, statusFilter, riskFilter, carrierFilter, groupBy, sortModel]);

  useEffect(() => {
    localStorage.setItem(visibleColumnStorageKey, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleToggleRow = (shipmentId: string) => {
    setSelectedIds((current) =>
      current.includes(shipmentId)
        ? current.filter((id) => id !== shipmentId)
        : [...current, shipmentId],
    );
  };

  const handleToggleAll = () => {
    const rowIds = rows.map((shipment) => shipment.id);
    const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id));

    setSelectedIds(allSelected ? [] : rowIds);
  };

  const handleBulkAction = (action: 'flag' | 'reassign' | 'notify') => {
    if (selectedIds.length === 0) {
      setAuditMessage('Select at least one shipment before running a bulk action.');
      return;
    }

    setPendingBulkAction(action);
  };

  const confirmBulkAction = () => {
    if (!pendingBulkAction) {
      return;
    }

    const labels = {
      flag: 'flag selected shipments',
      reassign: 'reassign carrier for selected shipments',
      notify: 'notify customers for selected shipments',
    };

    setAuditMessage(
      `Audit: ${selectedIds.length} shipment(s) queued for ${labels[pendingBulkAction]} at ${new Date().toLocaleTimeString()}.`,
    );
    recordAuditEvent({
      action: labels[pendingBulkAction],
      actor: user?.name ?? 'Unknown operator',
      role: user?.role ?? 'Unknown',
      domain: 'Shipments',
      target: selectedIds.join(', '),
      details: `Bulk action completed from shipment grid for ${selectedIds.length} selected shipment(s).`,
    });
    setSelectedIds([]);
    setPendingBulkAction(null);
  };

  const handleExportCsv = () => {
    const csvRows = [
      ['Shipment', 'Reference', 'Origin', 'Destination', 'Carrier', 'Status', 'ETA', 'Risk', 'Orders'],
      ...rows.map((shipment) => [
        shipment.id,
        shipment.reference,
        shipment.origin,
        shipment.destination,
        shipment.carrier,
        shipment.status,
        shipment.estimatedArrival,
        shipment.dynamicRisk,
        shipment.linkedOrders.map((order) => order.id).join(' | '),
      ]),
    ];
    const csv = csvRows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `shipments-${selectedDataRegion}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setAuditMessage(`Audit: exported ${rows.length} visible shipment row(s) to CSV.`);
    recordAuditEvent({
      action: 'Export CSV',
      actor: user?.name ?? 'Unknown operator',
      role: user?.role ?? 'Unknown',
      domain: 'Shipments',
      target: `${rows.length} rows`,
      details: `Exported filtered shipment grid for ${selectedDataRegion}.`,
    });
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ pt: 0.5 }}>
        <OperationsHeader
          pageName="Shipments"
          liveUpdate={false}
          title="ORDER & SHIPMENT MANAGEMENT"
          desc={`Server-driven shipment grid, order context and bulk workflows in ${selectedDataRegion}.`}
        />
      </Box>

      <Stack spacing={1.5}>
        <Toolbar
          carrierFilter={carrierFilter}
          carrierOptions={carrierOptions}
          groupBy={groupBy}
          riskFilter={riskFilter}
          searchText={searchText}
          statusFilter={statusFilter}
          onCarrierChange={setCarrierFilter}
          onGroupChange={setGroupBy}
          onRiskChange={setRiskFilter}
          onSearchChange={setSearchText}
          onStatusChange={setStatusFilter}
        />

        <SortAndColumnBar
          sortModel={sortModel}
          visibleColumns={visibleColumns}
          onSortChange={setSortModel}
          onVisibleColumnsChange={setVisibleColumns}
        />

        <BulkActionBar
          auditMessage={auditMessage}
          selectedCount={selectedIds.length}
          totalCount={data?.total ?? 0}
          onAction={handleBulkAction}
          onExport={handleExportCsv}
        />
      </Stack>

      <Box
        sx={{
          border: '1px solid #d9e3ed',
          borderRadius: '12px',
          backgroundColor: '#f2f6fa',
          overflow: 'hidden',
        }}
      >
        <TableContainer sx={{ backgroundColor: '#f5f8fb' }}>
          <Table sx={{ minWidth: 1060 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#e9f0f5',
                  '& th': {
                    color: '#63758c',
                    fontSize: 11,
                    fontWeight: 800,
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
                    checked={rows.length > 0 && rows.every((shipment) => selectedIds.includes(shipment.id))}
                    indeterminate={
                      rows.some((shipment) => selectedIds.includes(shipment.id)) &&
                      !rows.every((shipment) => selectedIds.includes(shipment.id))
                    }
                    onChange={handleToggleAll}
                  />
                </TableCell>
                {columns.map(
                  (column) =>
                    visibleColumns[column.id] && <TableCell key={column.id}>{column.label}</TableCell>,
                )}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnCount(visibleColumns) + 2} sx={{ py: 5, textAlign: 'center' }}>
                    {isFetching ? 'Loading shipments...' : 'No shipments match the current criteria.'}
                  </TableCell>
                </TableRow>
              ) : (
                groupedRows.map((group) => (
                  <>
                    {groupBy !== 'none' && (
                      <TableRow key={`${group.label}-group`}>
                        <TableCell
                          colSpan={visibleColumnCount(visibleColumns) + 2}
                          sx={{
                            backgroundColor: '#f1f6fa',
                            color: '#36506a',
                            fontSize: 12,
                            fontWeight: 900,
                            py: 1,
                          }}
                        >
                          {group.label} ({group.rows.length})
                        </TableCell>
                      </TableRow>
                    )}
                    {group.rows.map((shipment) => (
                      <ShipmentRow
                        key={shipment.id}
                        shipment={shipment}
                        visibleColumns={visibleColumns}
                        selected={selectedIds.includes(shipment.id)}
                        onOpen={() => setSelectedShipment(shipment)}
                        onToggle={() => handleToggleRow(shipment.id)}
                      />
                    ))}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 2,
            backgroundColor: '#f6f9fc',
            borderTop: '1px solid #e2eaf1',
          }}
        >
          <Typography sx={{ color: '#617691', fontSize: 12, fontWeight: 700 }}>
            {data?.total ?? 0} shipment(s), page {data?.page ?? page} of {totalPages}
          </Typography>
          <Pagination count={totalPages} page={data?.page ?? page} onChange={handlePageChange} color="primary" />
        </Box>
      </Box>

      <ShipmentDetailDrawer shipment={selectedShipment} onClose={() => setSelectedShipment(null)} />
      <ConfirmDialog
        open={Boolean(pendingBulkAction)}
        title="Confirm Bulk Action"
        description={
          pendingBulkAction
            ? `Apply this action to ${selectedIds.length} selected shipment(s)? The action will be recorded in the audit log.`
            : ''
        }
        confirmLabel="Apply action"
        tone={pendingBulkAction === 'notify' ? 'default' : 'warning'}
        onCancel={() => setPendingBulkAction(null)}
        onConfirm={confirmBulkAction}
      />
    </Stack>
  );
}

function Toolbar({
  carrierFilter,
  carrierOptions,
  groupBy,
  riskFilter,
  searchText,
  statusFilter,
  onCarrierChange,
  onGroupChange,
  onRiskChange,
  onSearchChange,
  onStatusChange,
}: {
  carrierFilter: string;
  carrierOptions: string[];
  groupBy: ShipmentGroupBy;
  riskFilter: (typeof riskOptions)[number];
  searchText: string;
  statusFilter: (typeof statusOptions)[number];
  onCarrierChange: (value: string) => void;
  onGroupChange: (value: ShipmentGroupBy) => void;
  onRiskChange: (value: (typeof riskOptions)[number]) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: (typeof statusOptions)[number]) => void;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(320px, 1.5fr) repeat(4, minmax(150px, 0.7fr))' },
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
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search reference, customer, PO, container, trailer..."
          sx={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#1d2b3b',
            fontSize: 14,
          }}
        />
      </Box>
      <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={onStatusChange} />
      <FilterSelect label="Risk" value={riskFilter} options={riskOptions} onChange={onRiskChange} />
      <FilterSelect label="Carrier" value={carrierFilter} options={carrierOptions} onChange={onCarrierChange} />
      <FilterSelect
        label="Group"
        value={groupBy}
        options={groupOptions.map((option) => option.value)}
        optionLabel={(value) => groupOptions.find((option) => option.value === value)?.label ?? value}
        onChange={onGroupChange}
      />
    </Box>
  );
}

function SortAndColumnBar({
  sortModel,
  visibleColumns,
  onSortChange,
  onVisibleColumnsChange,
}: {
  sortModel: ShipmentSort[];
  visibleColumns: Record<ColumnId, boolean>;
  onSortChange: (value: ShipmentSort[]) => void;
  onVisibleColumnsChange: (value: Record<ColumnId, boolean>) => void;
}) {
  const primarySort = sortModel[0] ?? { field: 'estimatedArrival', direction: 'asc' as const };
  const secondarySort = sortModel[1] ?? { field: 'risk', direction: 'desc' as const };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        flexWrap: 'wrap',
        border: '1px solid #d9e3ed',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        p: 1.2,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <SortSelect
          label="Sort 1"
          field={primarySort.field}
          direction={primarySort.direction}
          onFieldChange={(field) => onSortChange([{ ...primarySort, field }, secondarySort])}
          onDirectionChange={(direction) => onSortChange([{ ...primarySort, direction }, secondarySort])}
        />
        <SortSelect
          label="Sort 2"
          field={secondarySort.field}
          direction={secondarySort.direction}
          onFieldChange={(field) => onSortChange([primarySort, { ...secondarySort, field }])}
          onDirectionChange={(direction) => onSortChange([primarySort, { ...secondarySort, direction }])}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 0.4 }}>
        {columns.map((column) => (
          <FormControlLabel
            key={column.id}
            control={
              <Checkbox
                size="small"
                checked={visibleColumns[column.id]}
                onChange={() =>
                  onVisibleColumnsChange({
                    ...visibleColumns,
                    [column.id]: !visibleColumns[column.id],
                  })
                }
              />
            }
            label={<Typography sx={{ fontSize: 12, fontWeight: 700 }}>{column.label}</Typography>}
          />
        ))}
      </Stack>
    </Box>
  );
}

function SortSelect({
  direction,
  field,
  label,
  onDirectionChange,
  onFieldChange,
}: {
  direction: 'asc' | 'desc';
  field: ShipmentSortField;
  label: string;
  onDirectionChange: (value: 'asc' | 'desc') => void;
  onFieldChange: (value: ShipmentSortField) => void;
}) {
  const sortFields: ShipmentSortField[] = [
    'id',
    'carrier',
    'status',
    'risk',
    'plannedArrival',
    'estimatedArrival',
    'customer',
  ];

  return (
    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
      <Typography sx={{ color: '#617691', fontSize: 12, fontWeight: 800 }}>{label}</Typography>
      <FilterSelect label="Field" value={field} options={sortFields} onChange={onFieldChange} />
      <FilterSelect label="Direction" value={direction} options={['asc', 'desc']} onChange={onDirectionChange} />
    </Stack>
  );
}

function BulkActionBar({
  auditMessage,
  selectedCount,
  totalCount,
  onAction,
  onExport,
}: {
  auditMessage: string;
  selectedCount: number;
  totalCount: number;
  onAction: (action: 'flag' | 'reassign' | 'notify') => void;
  onExport: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        flexWrap: 'wrap',
        border: '1px solid #d9e3ed',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        px: 1.4,
        py: 1,
      }}
    >
      <Typography sx={{ color: '#52677f', fontSize: 13, fontWeight: 800 }}>
        {selectedCount} selected / {totalCount} in result set
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={() => onAction('flag')}>
          Flag
        </Button>
        <Button size="small" variant="outlined" onClick={() => onAction('reassign')}>
          Reassign carrier
        </Button>
        <Button size="small" variant="contained" onClick={() => onAction('notify')}>
          Notify customer
        </Button>
        <Button size="small" variant="outlined" onClick={onExport}>
          Export CSV
        </Button>
      </Stack>
      {auditMessage && (
        <Typography sx={{ width: '100%', color: '#2f6f61', fontSize: 12, fontWeight: 700 }}>
          {auditMessage}
        </Typography>
      )}
    </Box>
  );
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function ShipmentRow({
  onOpen,
  onToggle,
  selected,
  shipment,
  visibleColumns,
}: {
  onOpen: () => void;
  onToggle: () => void;
  selected: boolean;
  shipment: Shipment;
  visibleColumns: Record<ColumnId, boolean>;
}) {
  return (
    <TableRow
      sx={{
        backgroundColor: '#ffffff',
        '&:hover': { backgroundColor: '#f8fbff' },
        '& td': { borderBottom: '1px solid #edf1f6', px: 1.5, py: 1.4 },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onToggle} />
      </TableCell>
      {visibleColumns.shipment && (
        <TableCell>
          <Typography sx={{ color: '#1a8d8d', fontSize: 15, fontWeight: 800 }}>{shipment.id}</Typography>
          <Typography sx={{ color: '#7a8a9e', fontSize: 10 }}>{shipment.reference}</Typography>
          <Typography sx={{ color: '#7a8a9e', fontSize: 10 }}>{shipment.poNumber}</Typography>
        </TableCell>
      )}
      {visibleColumns.lane && (
        <TableCell>
          <Typography sx={{ color: '#1d2d3f', fontSize: 14, fontWeight: 700 }}>
            {shipment.origin}
          </Typography>
          <Typography sx={{ color: '#647b99', fontSize: 11 }}>to {shipment.destination}</Typography>
        </TableCell>
      )}
      {visibleColumns.carrier && <TableCell>{shipment.carrier}</TableCell>}
      {visibleColumns.status && (
        <TableCell>
          <Chip label={shipment.status} sx={chipSx(getStatusColor(shipment.status))} />
        </TableCell>
      )}
      {visibleColumns.arrival && (
        <TableCell>
          <ArrivalPair planned={shipment.plannedArrival} estimated={shipment.estimatedArrival} />
        </TableCell>
      )}
      {visibleColumns.risk && (
        <TableCell>
          <Chip label={shipment.dynamicRisk} sx={chipSx(getRiskColor(shipment.dynamicRisk))} />
        </TableCell>
      )}
      {visibleColumns.orders && (
        <TableCell>
          <Typography sx={{ color: '#1d2d3f', fontSize: 12, fontWeight: 800 }}>
            {shipment.linkedOrders.map((order) => order.id).join(', ') || 'No order'}
          </Typography>
          <Typography sx={{ color: '#647b99', fontSize: 11 }}>{shipment.containerId}</Typography>
        </TableCell>
      )}
      <TableCell>
        <Button size="small" variant="outlined" onClick={onOpen}>
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
}

function ShipmentDetailDrawer({
  onClose,
  shipment,
}: {
  onClose: () => void;
  shipment: Shipment | null;
}) {
  return (
    <Drawer anchor="right" open={Boolean(shipment)} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 520 }, p: 2.4 }}>
        {shipment && (
          <Stack spacing={2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ color: '#0f8d81', fontSize: 12, fontWeight: 900 }}>
                  {shipment.reference}
                </Typography>
                <Typography sx={{ color: '#13283d', fontSize: 26, fontWeight: 900 }}>
                  {shipment.id}
                </Typography>
                <Typography sx={{ color: '#65788d', fontSize: 13 }}>
                  {shipment.origin} to {shipment.destination} - {shipment.carrier}
                </Typography>
              </Box>
              <Button size="small" onClick={onClose}>
                Close
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Chip label={shipment.status} sx={chipSx(getStatusColor(shipment.status))} />
              <Chip label={`Risk ${shipment.dynamicRisk}`} sx={chipSx(getRiskColor(shipment.dynamicRisk))} />
              <Chip label={shipment.assetId} />
              <Chip label={shipment.trailerId} />
            </Stack>

            <Divider />

            <Section title="Lifecycle Timeline">
              <Stack spacing={1}>
                {shipment.milestones.map((milestone) => (
                  <Box
                    key={milestone.id}
                    sx={{
                      borderLeft: `4px solid ${getMilestoneColor(milestone.status)}`,
                      backgroundColor: '#f8fbfd',
                      borderRadius: '8px',
                      p: 1.2,
                    }}
                  >
                    <Typography sx={{ color: '#13283d', fontSize: 13, fontWeight: 900 }}>
                      {milestone.label}
                    </Typography>
                    <Typography sx={{ color: '#65788d', fontSize: 12 }}>
                      {milestone.status} - {formatDateTime(milestone.timestamp)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Linked Orders">
              <Stack spacing={1.2}>
                {shipment.linkedOrders.map((order) => (
                  <Box key={order.id} sx={{ border: '1px solid #d9e3ed', borderRadius: '8px', p: 1.2 }}>
                    <Typography sx={{ color: '#13283d', fontSize: 14, fontWeight: 900 }}>
                      {order.id} - {order.poNumber}
                    </Typography>
                    <Typography sx={{ color: '#65788d', fontSize: 12, mb: 1 }}>
                      {order.customer} - {order.allocationStatus}
                    </Typography>
                    {order.lines.map((line) => (
                      <Stack
                        key={line.sku}
                        direction="row"
                        sx={{ justifyContent: 'space-between', gap: 1, py: 0.45 }}
                      >
                        <Typography sx={{ color: '#22364d', fontSize: 12, fontWeight: 700 }}>
                          {line.sku} - {line.description}
                        </Typography>
                        <Typography sx={{ color: '#52677f', fontSize: 12 }}>
                          {line.quantity} / {line.status}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Documents">
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {shipment.documents.map((document) => (
                  <Chip
                    key={document.id}
                    label={`${document.type}: ${document.status}`}
                    color={document.status === 'Available' ? 'success' : 'default'}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Section>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Box>
      <Typography sx={{ color: '#0f8d81', fontSize: 11, fontWeight: 900, mb: 1, letterSpacing: 1.4 }}>
        {title.toUpperCase()}
      </Typography>
      {children}
    </Box>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  optionLabel,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  optionLabel?: (value: T) => string;
  onChange: (value: T) => void;
}) {
  return (
    <Box sx={{ height: 38, border: '1px solid #d5e0eb', borderRadius: '10px', backgroundColor: '#ffffff' }}>
      <Select
        value={value}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value as T)}
        IconComponent={KeyboardArrowDownRounded}
        displayEmpty
        sx={{
          width: '100%',
          height: '100%',
          color: '#1b2b40',
          fontSize: 13,
          fontWeight: 700,
          '& .MuiSelect-select': { px: 1.3, py: 0, display: 'flex', alignItems: 'center' },
          '& fieldset': { border: 'none' },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option === 'All' ? `${label}: All` : optionLabel?.(option) ?? option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

function ArrivalPair({ estimated, planned }: { estimated: string; planned: string }) {
  const late = new Date(estimated).getTime() > new Date(planned).getTime();

  return (
    <Box>
      <Typography sx={{ color: '#647b99', fontSize: 11 }}>Planned {formatDateTime(planned)}</Typography>
      <Typography sx={{ color: late ? '#b45309' : '#15253d', fontSize: 12, fontWeight: 900 }}>
        ETA {formatDateTime(estimated)}
      </Typography>
    </Box>
  );
}

function groupRows(rows: Shipment[], groupBy: ShipmentGroupBy) {
  if (groupBy === 'none') {
    return [{ label: 'All shipments', rows }];
  }

  const groups = new Map<string, Shipment[]>();

  rows.forEach((row) => {
    const label = String(row[groupBy]);
    groups.set(label, [...(groups.get(label) ?? []), row]);
  });

  return Array.from(groups.entries()).map(([label, groupRows]) => ({
    label,
    rows: groupRows,
  }));
}

function getPersistedColumns() {
  try {
    const value = localStorage.getItem(visibleColumnStorageKey);

    return value ? { ...defaultVisibleColumns, ...JSON.parse(value) } : defaultVisibleColumns;
  } catch {
    return defaultVisibleColumns;
  }
}

function visibleColumnCount(value: Record<ColumnId, boolean>) {
  return Object.values(value).filter(Boolean).length;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getStatusColor(status: ShipmentStatus) {
  switch (status) {
    case 'Delayed':
      return { bg: '#fff0dc', text: '#c57413' };
    case 'Delivered':
      return { bg: '#daf3ff', text: '#1079b3' };
    case 'At Dock':
      return { bg: '#e9ebff', text: '#5162d5' };
    default:
      return { bg: '#dff7ec', text: '#2f8f6b' };
  }
}

function getRiskColor(risk: RiskLevel) {
  switch (risk) {
    case 'High':
      return { bg: '#ffe8d6', text: '#d66b29' };
    case 'Medium':
      return { bg: '#e7ebff', text: '#4b5bc9' };
    default:
      return { bg: '#e6f4ea', text: '#3d8d61' };
  }
}

function chipSx(color: { bg: string; text: string }) {
  return {
    backgroundColor: color.bg,
    color: color.text,
    fontWeight: 800,
    fontSize: 11,
    borderRadius: '999px',
    height: 24,
    px: 0.8,
  };
}

function getMilestoneColor(status: string) {
  switch (status) {
    case 'Complete':
      return '#2f8f6b';
    case 'Current':
      return '#4b5bc9';
    case 'Exception':
      return '#d66b29';
    default:
      return '#cad5df';
  }
}
