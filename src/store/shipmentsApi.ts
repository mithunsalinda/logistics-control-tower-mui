import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Shipment {
  id: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Delayed';
}

const mockShipments: Shipment[] = [
  { id: 'SHP-1001', destination: 'Colombo', status: 'In Transit' },
  { id: 'SHP-1002', destination: 'Kandy', status: 'Delivered' },
  { id: 'SHP-1003', destination: 'Galle', status: 'Pending' },
  { id: 'SHP-1004', destination: 'Jaffna', status: 'Delayed' },
];

export const shipmentsApi = createApi({
  reducerPath: 'shipmentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Shipments'],
  endpoints: (builder) => ({
    getShipments: builder.query<Shipment[], void>({
      queryFn: async () => ({ data: mockShipments }),
      providesTags: ['Shipments'],
    }),
  }),
});

export const { useGetShipmentsQuery } = shipmentsApi;
