import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import { baseApi } from './api';
import { rootReducer } from './rootReducer';
import type { RootState } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type { RootState } from './rootReducer';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {
  useGetAuditEventsQuery,
  useGetCapacityForecastsQuery,
  useGetCapacityScenariosQuery,
  useGetDashboardMetricsQuery,
  useGetExceptionsQuery,
  useGetFacilitiesQuery,
  useGetFleetQuery,
  useGetMeQuery,
  useGetRoutePlansQuery,
  useGetShipmentsQuery,
  useGetUsersQuery,
  useGlobalSearchQuery,
  useLoginMutation,
  useLogoutMutation,
  useRecordAuditEventMutation,
  useUpdateUserMutation,
  useUpdateExceptionMutation,
} from './api';
export type {
  AuditEvent,
  CapacityForecast,
  CapacityScenario,
  DashboardMetric,
  ExceptionItem,
  ExceptionSeverity,
  ExceptionStatus,
  Facility,
  FacilityEvent,
  GlobalSearchResult,
  YardAppointment,
  RiskLevel,
  RouteConflict,
  RouteLeg,
  RouteOption,
  RoutePlan,
  RouteStop,
  ShipmentFacets,
  ShipmentGroupBy,
  Shipment,
  ShipmentSort,
  ShipmentSortField,
  ShipmentStatus,
  ShipmentsResponse,
  UserAccount,
  Vehicle,
  VehicleStatus,
} from './api';
export { login, logout, setCredentials } from './slices';
