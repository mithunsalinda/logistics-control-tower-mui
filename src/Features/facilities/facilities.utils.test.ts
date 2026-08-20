import { describe, expect, it } from 'vitest';

import type { Facility } from '../../store';
import {
  chipSx,
  getFacilitySummary,
  getFilteredFacilities,
  getSelectedFacility,
  getSeverityColor,
  getStatusColor,
  getUtilizationColor,
  getYardStatusColor,
} from './facilities.utils';

const baseFacility: Facility = {
  id: 'FAC-1',
  code: 'AMS',
  name: 'Amsterdam DC',
  region: 'EUROPE',
  status: 'Normal',
  dockUtilization: 72,
  inboundQueue: 4,
  outboundQueue: 3,
  averageDwell: 44,
  activeDoors: 12,
  staffing: 'Normal',
  affectedShipments: 2,
  inboundLoads: 8,
  outboundLoads: 7,
  events: [],
  appointments: [],
};

function facility(overrides: Partial<Facility>): Facility {
  return { ...baseFacility, ...overrides };
}

describe('facility domain logic', () => {
  it('filters facilities by selected region and free text', () => {
    const facilities = [
      facility({ id: 'EU-1', name: 'Amsterdam DC', region: 'EUROPE' }),
      facility({ id: 'NA-1', name: 'Chicago Hub', region: 'NORTH_AMERICA' }),
    ];

    const result = getFilteredFacilities({
      facilities,
      region: 'EUROPE',
      searchText: 'ams',
    });

    expect(result.map((item) => item.id)).toEqual(['EU-1']);
  });

  it('summarizes event, appointment, constrained, and affected shipment counts', () => {
    const summary = getFacilitySummary([
      facility({
        id: 'A',
        status: 'Constrained',
        affectedShipments: 3,
        events: [
          {
            id: 'EV-1',
            type: 'Congestion',
            severity: 'High',
            status: 'Open',
            description: 'Queue building',
            affectedShipments: ['SHP-1'],
            inboundLoads: 2,
            outboundLoads: 1,
            timestamp: '2026-08-20T08:00:00.000Z',
          },
        ],
        appointments: [
          {
            id: 'APT-1',
            shipmentId: 'SHP-1',
            carrier: 'BlueLine',
            trailerId: 'TRL-1',
            appointmentTime: '2026-08-20T09:00:00.000Z',
            yardStatus: 'Scheduled',
            door: 'D1',
          },
        ],
      }),
      facility({ id: 'B', affectedShipments: 5 }),
    ]);

    expect(summary).toEqual({
      affectedShipments: 8,
      constrainedFacilities: 1,
      totalAppointments: 1,
      totalEvents: 1,
    });
  });

  it('falls back to the first facility when selected id is missing', () => {
    const selected = getSelectedFacility([facility({ id: 'FIRST' })], 'UNKNOWN');

    expect(selected.id).toBe('FIRST');
  });

  it('classifies utilization colors by threshold', () => {
    expect(getUtilizationColor(90)).toBe('#d74d4d');
    expect(getUtilizationColor(80)).toBe('#d66b29');
    expect(getUtilizationColor(50)).toBe('#159d95');
  });

  it('maps status, severity, yard status, and chip presentation styles', () => {
    expect(getStatusColor('Constrained')).toMatchObject({ main: '#d66b29' });
    expect(getStatusColor('Normal')).toMatchObject({ main: '#2f8f6b' });

    expect(getSeverityColor('Critical')).toMatchObject({ main: '#d74d4d' });
    expect(getSeverityColor('High')).toMatchObject({ main: '#d66b29' });
    expect(getSeverityColor('Medium')).toMatchObject({ main: '#4b68cf' });
    expect(getSeverityColor('Low')).toMatchObject({ main: '#2f8f6b' });

    expect(getYardStatusColor('Late')).toMatchObject({ main: '#d74d4d' });
    expect(getYardStatusColor('In Yard')).toMatchObject({ main: '#d66b29' });
    expect(getYardStatusColor('At Door')).toMatchObject({ main: '#d66b29' });
    expect(getYardStatusColor('Departed')).toMatchObject({ main: '#2f8f6b' });
    expect(getYardStatusColor('Scheduled')).toMatchObject({ main: '#4b68cf' });

    expect(chipSx({ bg: 'white', border: 'black', text: 'blue' })).toMatchObject({
      backgroundColor: 'white',
      color: 'blue',
      height: 24,
    });
  });
});
