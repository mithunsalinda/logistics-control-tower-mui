import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ExceptionItem } from '../../store';
import { useExceptionsController } from './useExceptionsController';

const updateException = vi.fn();
const refetch = vi.fn();

vi.mock('../../store', () => ({
  useGetExceptionsQuery: vi.fn(() => ({
    data: [
      {
        id: 'EX-1',
        title: 'Critical Delay',
        category: 'Delay',
        domain: 'Shipments',
        severity: 'Critical',
        status: 'New',
        description: 'Late shipment',
        shipmentId: 'SHP-1',
        timestamp: '2026-08-20T08:00:00.000Z',
        assignee: 'Unassigned',
      },
    ],
    isFetching: false,
    refetch,
  })),
  useUpdateExceptionMutation: vi.fn(() => [
    updateException,
    { isLoading: false },
  ]),
}));

const exception: ExceptionItem = {
  id: 'EX-1',
  title: 'Critical Delay',
  category: 'Delay',
  domain: 'Shipments',
  severity: 'Critical',
  status: 'New',
  description: 'Late shipment',
  shipmentId: 'SHP-1',
  timestamp: '2026-08-20T08:00:00.000Z',
  assignee: 'Unassigned',
};

describe('useExceptionsController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    updateException.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
    refetch.mockResolvedValue({});
  });

  it('exposes fetched queue and persistent critical alerts', () => {
    const { result } = renderHook(() => useExceptionsController());

    expect(result.current.queue).toHaveLength(1);
    expect(result.current.criticalNew).toHaveLength(1);
  });

  it('shows and clears the simulated live preview toast', () => {
    const { result } = renderHook(() => useExceptionsController());

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.toastException?.id).toBe('LIVE-ETA-20260819');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toastException).toBeNull();
  });

  it('updates status and assignee through the mutation boundary', async () => {
    const { result } = renderHook(() => useExceptionsController());

    await act(async () => {
      await result.current.handleStatusChange(exception, 'Acknowledged');
      await result.current.handleAssigneeChange(exception, 'N. Gomez');
    });

    expect(updateException).toHaveBeenCalledWith({ id: 'EX-1', status: 'Acknowledged' });
    expect(updateException).toHaveBeenCalledWith({ id: 'EX-1', assignee: 'N. Gomez' });
    expect(refetch).toHaveBeenCalledTimes(2);
  });
});
