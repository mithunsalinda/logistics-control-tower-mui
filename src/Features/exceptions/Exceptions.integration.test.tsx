import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ExceptionItem } from '../../store';
import Exceptions from './Exceptions';
import { useExceptionsController } from './useExceptionsController';

vi.mock('./useExceptionsController');

const mockedUseExceptionsController = vi.mocked(useExceptionsController);

const exception: ExceptionItem = {
  id: 'EX-CRIT',
  title: 'Vehicle Breakdown',
  category: 'Breakdown',
  domain: 'Fleet',
  severity: 'Critical',
  status: 'New',
  description: 'Vehicle reported a critical mechanical fault.',
  shipmentId: 'SHP-00005',
  timestamp: '2026-08-20T08:00:00.000Z',
  assignee: 'Unassigned',
};

function setupController(overrides = {}) {
  const controller = {
    criticalNew: [exception],
    handleAssigneeChange: vi.fn(),
    handleStatusChange: vi.fn(),
    isFetching: false,
    isUpdating: false,
    queue: [exception],
    searchTerm: '',
    setSearchTerm: vi.fn(),
    setStatusFilter: vi.fn(),
    setThresholds: vi.fn(),
    setToastException: vi.fn(),
    statusFilter: 'Active',
    thresholds: {
      dwellMinutes: 45,
      etaSlippageMinutes: 30,
      missedScanMinutes: 20,
      reeferMaxTemp: 8,
    },
    toastException: null,
    ...overrides,
  };

  mockedUseExceptionsController.mockReturnValue(controller as ReturnType<typeof useExceptionsController>);
  return controller;
}

describe('Exception Management integration boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders live queue, persistent banner, and alert rules from controller state', () => {
    setupController();

    render(<Exceptions />);

    expect(screen.getByText('Exception Management')).toBeInTheDocument();
    expect(screen.getByText('Critical alert requires acknowledgement')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Alerting Rules')).toBeInTheDocument();
  });

  it('delegates search and status changes to the controller', async () => {
    const user = userEvent.setup();
    const controller = setupController();

    render(<Exceptions />);

    fireEvent.change(screen.getByPlaceholderText(/search exception/i), {
      target: { value: 'breakdown' },
    });
    expect(controller.setSearchTerm).toHaveBeenCalledWith('breakdown');

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    await user.click(screen.getByRole('option', { name: 'All' }));
    expect(controller.setStatusFilter).toHaveBeenCalledWith('All');
  });

  it('shows the loading empty state when no queue items are available', () => {
    setupController({ criticalNew: [], isFetching: true, queue: [] });

    render(<Exceptions />);

    expect(screen.getByText('Loading exceptions...')).toBeInTheDocument();
  });

  it('delegates lifecycle actions and alert threshold changes', async () => {
    const user = userEvent.setup();
    const controller = setupController();

    render(<Exceptions />);

    await user.click(screen.getByRole('button', { name: 'Ack' }));
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Resolve' }));

    expect(controller.handleStatusChange).toHaveBeenCalledWith(exception, 'Acknowledged');
    expect(controller.handleStatusChange).toHaveBeenCalledWith(exception, 'In Progress');
    expect(controller.handleStatusChange).toHaveBeenCalledWith(exception, 'Resolved');

    const thresholdInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(thresholdInputs[0], { target: { value: '75' } });
    fireEvent.change(thresholdInputs[1], { target: { value: '45' } });
    fireEvent.change(thresholdInputs[2], { target: { value: '35' } });
    fireEvent.change(thresholdInputs[3], { target: { value: '10' } });

    expect(controller.setThresholds).toHaveBeenCalledWith(
      expect.objectContaining({ dwellMinutes: 75 }),
    );
    expect(controller.setThresholds).toHaveBeenCalledWith(
      expect.objectContaining({ etaSlippageMinutes: 45 }),
    );
    expect(controller.setThresholds).toHaveBeenCalledWith(
      expect.objectContaining({ missedScanMinutes: 35 }),
    );
    expect(controller.setThresholds).toHaveBeenCalledWith(
      expect.objectContaining({ reeferMaxTemp: 10 }),
    );
  });
});
