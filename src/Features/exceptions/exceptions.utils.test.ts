import { describe, expect, it } from 'vitest';

import type { ExceptionItem } from '../../store';
import { livePreviewException } from './exceptions.constants';
import {
  chipSx,
  formatDateTime,
  getCriticalNewExceptions,
  getExceptionQueue,
  getSeverityColor,
  getStatusColor,
  isPreviewException,
} from './exceptions.utils';

const baseException: ExceptionItem = {
  id: 'EX-1',
  title: 'ETA Slippage',
  category: 'Delay',
  domain: 'Shipments',
  severity: 'Medium',
  status: 'New',
  description: 'Projected miss',
  shipmentId: 'SHP-1',
  timestamp: '2026-08-20T08:00:00.000Z',
  assignee: 'Unassigned',
};

function makeException(overrides: Partial<ExceptionItem>): ExceptionItem {
  return { ...baseException, ...overrides };
}

describe('exception queue domain logic', () => {
  it('sorts active exceptions by severity and recency', () => {
    const queue = getExceptionQueue({
      exceptions: [
        makeException({ id: 'LOW', severity: 'Low', timestamp: '2026-08-20T10:00:00.000Z' }),
        makeException({ id: 'HIGH-OLD', severity: 'High', timestamp: '2026-08-20T09:00:00.000Z' }),
        makeException({ id: 'HIGH-NEW', severity: 'High', timestamp: '2026-08-20T11:00:00.000Z' }),
        makeException({ id: 'RESOLVED', severity: 'Critical', status: 'Resolved' }),
      ],
      livePreviewVisible: false,
      previewException: livePreviewException,
      searchTerm: '',
      statusFilter: 'Active',
    });

    expect(queue.map((item) => item.id)).toEqual(['HIGH-NEW', 'HIGH-OLD', 'LOW']);
  });

  it('filters by text across shipment, category, domain, and assignee', () => {
    const queue = getExceptionQueue({
      exceptions: [
        makeException({ id: 'MATCH', assignee: 'K. Patel', shipmentId: 'SHP-900' }),
        makeException({ id: 'MISS', assignee: 'N. Gomez', shipmentId: 'SHP-100' }),
      ],
      livePreviewVisible: false,
      previewException: livePreviewException,
      searchTerm: 'patel',
      statusFilter: 'All',
    });

    expect(queue).toHaveLength(1);
    expect(queue[0].id).toBe('MATCH');
  });

  it('identifies persistent critical new exceptions', () => {
    const criticalNew = getCriticalNewExceptions([
      makeException({ id: 'CRIT', severity: 'Critical', status: 'New' }),
      makeException({ id: 'ACK', severity: 'Critical', status: 'Acknowledged' }),
    ]);

    expect(criticalNew.map((item) => item.id)).toEqual(['CRIT']);
  });

  it('detects preview exceptions and exposes severity colors', () => {
    expect(isPreviewException(livePreviewException)).toBe(true);
    expect(getSeverityColor('Critical')).toMatchObject({ main: '#d32f2f' });
    expect(getSeverityColor('High')).toMatchObject({ main: '#d66b29' });
    expect(getSeverityColor('Medium')).toMatchObject({ main: '#4b68cf' });
    expect(getSeverityColor('Low')).toMatchObject({ main: '#159d95' });
  });

  it('maps status and chip styles for presentation', () => {
    expect(getStatusColor('Resolved')).toMatchObject({ main: '#2f8f6b' });
    expect(getStatusColor('In Progress')).toMatchObject({ main: '#4b68cf' });
    expect(getStatusColor('Acknowledged')).toMatchObject({ main: '#d66b29' });
    expect(getStatusColor('New')).toMatchObject({ main: '#d32f2f' });
    expect(chipSx({ bg: 'white', border: 'black', text: 'blue' })).toMatchObject({
      backgroundColor: 'white',
      color: 'blue',
      height: 24,
    });
  });

  it('formats event timestamps for display', () => {
    expect(formatDateTime('2026-08-20T08:30:00.000Z')).toEqual(expect.any(String));
  });
});
