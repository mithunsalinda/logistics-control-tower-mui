import { baseApi } from './baseApi';

export type ShipmentStatus = 'In Transit' | 'Delayed' | 'Delivered' | 'At Dock';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ExceptionSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ExceptionStatus = 'New' | 'Acknowledged' | 'In Progress' | 'Resolved';
export type VehicleStatus = 'In Transit' | 'Delayed' | 'Loading' | 'Maintenance' | 'Offline' | 'Idle';
export type DriverDutyState = 'Driving' | 'On Duty' | 'Off Duty' | 'Sleeper Berth';
export type ShipmentSortField =
  | 'id'
  | 'carrier'
  | 'status'
  | 'risk'
  | 'plannedArrival'
  | 'estimatedArrival'
  | 'customer';
export type SortDirection = 'asc' | 'desc';
export type ShipmentGroupBy = 'none' | 'status' | 'risk' | 'carrier';
export type RouteStopStatus = 'Complete' | 'Current' | 'Pending' | 'Blocked';
export type RouteLegStatus = 'On Track' | 'Delayed' | 'Blocked';
export type RouteOptionType = 'Planned' | 'Reroute';
export type GlobalSearchDomain = 'Shipments' | 'Orders' | 'Assets' | 'Facilities';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  description: string;
}

export interface Shipment {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  eta: string;
  risk: RiskLevel;
  customer: string;
  mode: string;
  region: string;
  plannedArrival: string;
  estimatedArrival: string;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  dynamicRisk: RiskLevel;
  poNumber: string;
  containerId: string;
  trailerId: string;
  assetId: string;
  orderIds: string[];
  milestones: ShipmentMilestone[];
  documents: ShipmentDocument[];
  linkedOrders: Order[];
}

export interface ShipmentMilestone {
  id: string;
  label: string;
  status: 'Complete' | 'Current' | 'Pending' | 'Exception';
  timestamp: string;
}

export interface ShipmentDocument {
  id: string;
  name: string;
  type: 'BOL' | 'POD' | 'Invoice' | 'Customs';
  status: 'Available' | 'Pending' | 'Missing';
}

export interface OrderLine {
  sku: string;
  description: string;
  quantity: number;
  status: string;
}

export interface Order {
  id: string;
  customer: string;
  poNumber: string;
  allocationStatus: string;
  shipmentIds: string[];
  lines: OrderLine[];
}

export interface ShipmentSort {
  field: ShipmentSortField;
  direction: SortDirection;
}

export interface GetShipmentsArgs {
  region: string;
  search?: string;
  status?: ShipmentStatus | 'All';
  risk?: RiskLevel | 'All';
  carrier?: string;
  page: number;
  pageSize: number;
  sort: ShipmentSort[];
  groupBy: ShipmentGroupBy;
}

export interface ShipmentFacets {
  carriers: string[];
  statuses: ShipmentStatus[];
  risks: RiskLevel[];
}

export interface ShipmentsResponse {
  rows: Shipment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  groupBy: ShipmentGroupBy;
  facets: ShipmentFacets;
}

export interface Vehicle {
  id: string;
  type: 'Van' | 'Truck' | 'Reefer' | 'Tractor';
  driver: string;
  status: VehicleStatus;
  speed: number;
  hoursRemaining: number;
  dutyState: DriverDutyState;
  telemetry: string;
  utilization: number;
  fuelLevel: number;
  chargeLevel: number | null;
  engineFaults: string[];
  temperature: number | null;
  depot: string;
  region: string;
}

export interface ExceptionItem {
  id: string;
  title: string;
  category: string;
  domain: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  description: string;
  shipmentId: string;
  timestamp: string;
  assignee: string;
}

export interface Facility {
  id: string;
  code: string;
  name: string;
  region: string;
  status: 'Constrained' | 'Normal';
  dockUtilization: number;
  inboundQueue: number;
  outboundQueue: number;
  averageDwell: number;
  activeDoors: number;
  staffing: 'Constrained' | 'Normal';
  affectedShipments: number;
  inboundLoads: number;
  outboundLoads: number;
  events: FacilityEvent[];
  appointments: YardAppointment[];
}

export interface FacilityEvent {
  id: string;
  type: 'Dock outage' | 'Congestion' | 'Staffing gap' | 'Yard hold';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Monitoring' | 'Resolved';
  description: string;
  affectedShipments: string[];
  inboundLoads: number;
  outboundLoads: number;
  timestamp: string;
}

export interface YardAppointment {
  id: string;
  shipmentId: string;
  carrier: string;
  trailerId: string;
  appointmentTime: string;
  yardStatus: 'Scheduled' | 'Arrived' | 'In Yard' | 'At Door' | 'Departed' | 'Late';
  door: string;
}

export interface CapacityForecast {
  id: string;
  region: string;
  horizonDays: number;
  origin: string;
  destination: string;
  facility: string;
  facilityCode: string;
  demand: number;
  capacity: number;
  trend: number;
  direction: 'up' | 'down';
}

export interface CapacityScenario {
  id: string;
  region: string;
  name: string;
  description: string;
  horizonDays: number;
  reallocationLane: string;
  addedCapacity: number;
  projectedOtd: number;
  costImpactUsd: number;
  atRiskReduction: number;
  shortfallReduction: number;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended';
  defaultRegion: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  role: string;
  domain: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface GlobalSearchResult {
  id: string;
  domain: GlobalSearchDomain;
  title: string;
  subtitle: string;
  path: string;
}

export interface RouteStop {
  id: string;
  name: string;
  type: 'Origin' | 'Stop' | 'Destination';
  city: string;
  facilityCode: string;
  plannedArrival: string;
  estimatedArrival: string;
  status: RouteStopStatus;
}

export interface RouteLeg {
  id: string;
  from: string;
  to: string;
  mode: string;
  distanceKm: number;
  plannedMinutes: number;
  estimatedMinutes: number;
  status: RouteLegStatus;
}

export interface RouteOption {
  id: string;
  label: string;
  type: RouteOptionType;
  etaImpactMinutes: number;
  costImpactUsd: number;
  confidence: number;
  risk: RiskLevel;
  recommended: boolean;
  legs: RouteLeg[];
  stops: RouteStop[];
}

export interface RouteConflict {
  id: string;
  vehicleId: string;
  shipmentIds: string[];
  windowStart: string;
  windowEnd: string;
  severity: 'Medium' | 'High' | 'Critical';
  reason: string;
}

export interface RoutePlan {
  id: string;
  shipmentId: string;
  vehicleId: string;
  carrier: string;
  origin: string;
  destination: string;
  region: string;
  status: 'Healthy' | 'Disrupted' | 'Conflict';
  disruption: string;
  plannedRoute: RouteOption;
  candidateRoutes: RouteOption[];
  conflicts: RouteConflict[];
}

export const operationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<DashboardMetric[], void>({
      query: () => '/dashboardMetrics',
      providesTags: ['Dashboard'],
    }),
    getShipments: builder.query<ShipmentsResponse, GetShipmentsArgs>({
      queryFn: async (args, _api, _extraOptions, fetchWithBQ) => {
        const [shipmentResult, orderResult] = await Promise.all([
          fetchWithBQ('/shipments'),
          fetchWithBQ('/orders'),
        ]);

        if (shipmentResult.error) {
          return { error: shipmentResult.error };
        }

        if (orderResult.error) {
          return { error: orderResult.error };
        }

        const orders = orderResult.data as Order[];
        const enrichedShipments = (shipmentResult.data as Shipment[]).map((shipment, index) =>
          enrichShipment(shipment, orders, index),
        );
        const regionShipments = enrichedShipments.filter((shipment) => shipment.region === args.region);
        const facets = buildShipmentFacets(regionShipments);
        const filteredShipments = filterShipments(regionShipments, args);
        const sortedShipments = sortShipments(filteredShipments, args.sort);
        const totalPages = Math.max(1, Math.ceil(sortedShipments.length / args.pageSize));
        const page = Math.min(Math.max(args.page, 1), totalPages);
        const rows = sortedShipments.slice((page - 1) * args.pageSize, page * args.pageSize);

        return {
          data: {
            rows,
            total: sortedShipments.length,
            page,
            pageSize: args.pageSize,
            totalPages,
            groupBy: args.groupBy,
            facets,
          },
        };
      },
      providesTags: ['Shipments'],
    }),
    getFleet: builder.query<Vehicle[], void>({
      query: () => '/vehicles',
      providesTags: ['Fleet'],
    }),
    getUsers: builder.query<UserAccount[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<UserAccount, Partial<UserAccount> & Pick<UserAccount, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Users', 'Audit'],
    }),
    getAuditEvents: builder.query<AuditEvent[], void>({
      query: () => '/auditEvents',
      providesTags: ['Audit'],
    }),
    recordAuditEvent: builder.mutation<AuditEvent, Omit<AuditEvent, 'id' | 'timestamp'>>({
      query: (event) => ({
        url: '/auditEvents',
        method: 'POST',
        body: {
          ...event,
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Audit'],
    }),
    globalSearch: builder.query<GlobalSearchResult[], string>({
      queryFn: async (term, _api, _extraOptions, fetchWithBQ) => {
        const query = term.trim().toLowerCase();

        if (query.length < 2) {
          return { data: [] };
        }

        const [shipmentResult, orderResult, fleetResult, facilityResult] = await Promise.all([
          fetchWithBQ('/shipments'),
          fetchWithBQ('/orders'),
          fetchWithBQ('/vehicles'),
          fetchWithBQ('/facilities'),
        ]);

        const error =
          shipmentResult.error || orderResult.error || fleetResult.error || facilityResult.error;

        if (error) {
          return { error };
        }

        const shipmentResults = (shipmentResult.data as Shipment[])
          .filter((shipment) =>
            [
              shipment.id,
              shipment.reference,
              shipment.customer,
              shipment.origin,
              shipment.destination,
              shipment.carrier,
            ]
              .join(' ')
              .toLowerCase()
              .includes(query),
          )
          .map((shipment) => ({
            id: shipment.id,
            domain: 'Shipments' as const,
            title: shipment.id,
            subtitle: `${shipment.origin} to ${shipment.destination} / ${shipment.carrier}`,
            path: '/shipments',
          }));

        const orderResults = (orderResult.data as Order[])
          .filter((order) =>
            [
              order.id,
              order.customer,
              order.poNumber,
              order.allocationStatus,
              order.lines.map((line) => `${line.sku} ${line.description}`).join(' '),
            ]
              .join(' ')
              .toLowerCase()
              .includes(query),
          )
          .map((order) => ({
            id: order.id,
            domain: 'Orders' as const,
            title: order.id,
            subtitle: `${order.customer} / ${order.poNumber}`,
            path: '/shipments',
          }));

        const assetResults = (fleetResult.data as Vehicle[])
          .filter((vehicle) =>
            [vehicle.id, vehicle.driver, vehicle.type, vehicle.depot, vehicle.status]
              .join(' ')
              .toLowerCase()
              .includes(query),
          )
          .map((vehicle) => ({
            id: vehicle.id,
            domain: 'Assets' as const,
            title: vehicle.id,
            subtitle: `${vehicle.driver} / ${vehicle.depot} / ${vehicle.status}`,
            path: '/fleet',
          }));

        const facilityResults = (facilityResult.data as Facility[])
          .filter((facility) =>
            [facility.code, facility.name, facility.status, facility.staffing]
              .join(' ')
              .toLowerCase()
              .includes(query),
          )
          .map((facility) => ({
            id: facility.id,
            domain: 'Facilities' as const,
            title: facility.name,
            subtitle: `${facility.code} / ${facility.status}`,
            path: '/facilities',
          }));

        return { data: [...shipmentResults, ...orderResults, ...assetResults, ...facilityResults].slice(0, 8) };
      },
    }),
    getExceptions: builder.query<ExceptionItem[], void>({
      query: () => '/exceptions',
      providesTags: ['Exceptions'],
    }),
    updateException: builder.mutation<ExceptionItem, Partial<ExceptionItem> & Pick<ExceptionItem, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/exceptions/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Exceptions'],
    }),
    getFacilities: builder.query<Facility[], void>({
      query: () => '/facilities',
      providesTags: ['Facilities'],
    }),
    getCapacityForecasts: builder.query<CapacityForecast[], void>({
      query: () => '/capacityForecasts',
      providesTags: ['Capacity'],
    }),
    getCapacityScenarios: builder.query<CapacityScenario[], void>({
      query: () => '/capacityScenarios',
      providesTags: ['Capacity'],
    }),
    getRoutePlans: builder.query<RoutePlan[], void>({
      query: () => '/routePlans',
      providesTags: ['Routes'],
    }),
  }),
});

export const {
  useGetCapacityForecastsQuery,
  useGetCapacityScenariosQuery,
  useGetDashboardMetricsQuery,
  useGetExceptionsQuery,
  useGetFacilitiesQuery,
  useGetFleetQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetAuditEventsQuery,
  useGetRoutePlansQuery,
  useGetShipmentsQuery,
  useUpdateExceptionMutation,
  useGlobalSearchQuery,
  useRecordAuditEventMutation,
} = operationsApi;

function enrichShipment(shipment: Shipment, orders: Order[], index: number): Shipment {
  const estimatedArrival = shipment.estimatedArrival ?? shipment.eta;
  const plannedArrival = shipment.plannedArrival ?? shiftIsoTime(estimatedArrival, -(index % 4) - 1);
  const deliveryWindowStart = shipment.deliveryWindowStart ?? shiftIsoTime(plannedArrival, -1);
  const deliveryWindowEnd = shipment.deliveryWindowEnd ?? shiftIsoTime(plannedArrival, 2);
  const linkedOrders = orders.filter(
    (order) => order.shipmentIds.includes(shipment.id) || order.customer === shipment.customer,
  );
  const firstOrder = linkedOrders[0];
  const minutesLate =
    (new Date(estimatedArrival).getTime() - new Date(deliveryWindowEnd).getTime()) / 60000;
  const dynamicRisk = getDynamicRisk(shipment.risk, minutesLate);

  return {
    ...shipment,
    plannedArrival,
    estimatedArrival,
    deliveryWindowStart,
    deliveryWindowEnd,
    dynamicRisk,
    poNumber: shipment.poNumber ?? firstOrder?.poNumber ?? `PO-${88000 + index}`,
    containerId: shipment.containerId ?? `CONT-${shipment.id.replace(/\D/g, '').padStart(6, '0')}`,
    trailerId: shipment.trailerId ?? `TRL-${shipment.id.slice(-5)}`,
    assetId: shipment.assetId ?? `VEH-${(index + 2).toString().padStart(4, '0')}`,
    orderIds: shipment.orderIds ?? linkedOrders.map((order) => order.id),
    linkedOrders,
    milestones:
      shipment.milestones ??
      buildMilestones(shipment.id, plannedArrival, estimatedArrival, shipment.status, dynamicRisk),
    documents:
      shipment.documents ??
      [
        { id: `${shipment.id}-bol`, name: 'Bill of lading', type: 'BOL', status: 'Available' },
        { id: `${shipment.id}-pod`, name: 'Proof of delivery', type: 'POD', status: shipment.status === 'Delivered' ? 'Available' : 'Pending' },
        { id: `${shipment.id}-customs`, name: 'Customs packet', type: 'Customs', status: shipment.mode === 'Ocean' || shipment.mode === 'Air' ? 'Available' : 'Pending' },
      ],
  };
}

function buildMilestones(
  shipmentId: string,
  plannedArrival: string,
  estimatedArrival: string,
  status: ShipmentStatus,
  risk: RiskLevel,
): ShipmentMilestone[] {
  return [
    {
      id: `${shipmentId}-created`,
      label: 'Order tendered',
      status: 'Complete',
      timestamp: shiftIsoTime(plannedArrival, -28),
    },
    {
      id: `${shipmentId}-pickup`,
      label: 'Pickup confirmed',
      status: 'Complete',
      timestamp: shiftIsoTime(plannedArrival, -20),
    },
    {
      id: `${shipmentId}-transit`,
      label: status === 'At Dock' ? 'At dock' : 'In transit',
      status: risk === 'High' ? 'Exception' : 'Current',
      timestamp: shiftIsoTime(estimatedArrival, -5),
    },
    {
      id: `${shipmentId}-delivery`,
      label: 'Delivery',
      status: status === 'Delivered' ? 'Complete' : 'Pending',
      timestamp: estimatedArrival,
    },
  ];
}

function filterShipments(shipments: Shipment[], args: GetShipmentsArgs) {
  const query = args.search?.trim().toLowerCase() ?? '';

  return shipments.filter((shipment) => {
    const searchText = [
      shipment.id,
      shipment.reference,
      shipment.customer,
      shipment.poNumber,
      shipment.containerId,
      shipment.trailerId,
      shipment.origin,
      shipment.destination,
      shipment.carrier,
      shipment.linkedOrders.map((order) => order.lines.map((line) => line.sku).join(' ')).join(' '),
    ]
      .join(' ')
      .toLowerCase();

    return (
      (query.length === 0 || searchText.includes(query)) &&
      (!args.status || args.status === 'All' || shipment.status === args.status) &&
      (!args.risk || args.risk === 'All' || shipment.dynamicRisk === args.risk) &&
      (!args.carrier || args.carrier === 'All' || shipment.carrier === args.carrier)
    );
  });
}

function sortShipments(shipments: Shipment[], sortModel: ShipmentSort[]) {
  if (sortModel.length === 0) {
    return shipments;
  }

  return [...shipments].sort((a, b) => {
    for (const sort of sortModel) {
      const left = a[sort.field];
      const right = b[sort.field];
      const result = String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      if (result !== 0) {
        return sort.direction === 'asc' ? result : -result;
      }
    }

    return 0;
  });
}

function buildShipmentFacets(shipments: Shipment[]): ShipmentFacets {
  return {
    carriers: Array.from(new Set(shipments.map((shipment) => shipment.carrier))).sort(),
    statuses: Array.from(new Set(shipments.map((shipment) => shipment.status))).sort(),
    risks: Array.from(new Set(shipments.map((shipment) => shipment.dynamicRisk))).sort(),
  };
}

function getDynamicRisk(baseRisk: RiskLevel, minutesLate: number): RiskLevel {
  if (baseRisk === 'High' || minutesLate > 45) {
    return 'High';
  }

  if (baseRisk === 'Medium' || minutesLate > 0) {
    return 'Medium';
  }

  return 'Low';
}

function shiftIsoTime(value: string, hours: number) {
  return new Date(new Date(value).getTime() + hours * 60 * 60 * 1000).toISOString();
}
