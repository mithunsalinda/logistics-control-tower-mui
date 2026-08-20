import type { ExceptionItem, ExceptionSeverity } from '../../store';

export const severityRank: Record<ExceptionSeverity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const statusOptions = ['Active', 'All', 'New', 'Acknowledged', 'In Progress', 'Resolved'] as const;

export type ExceptionStatusFilter = (typeof statusOptions)[number];

export interface AlertThresholds {
  dwellMinutes: number;
  etaSlippageMinutes: number;
  missedScanMinutes: number;
  reeferMaxTemp: number;
}

export const defaultAlertThresholds: AlertThresholds = {
  dwellMinutes: 45,
  etaSlippageMinutes: 30,
  missedScanMinutes: 20,
  reeferMaxTemp: 8,
};

export const assigneeOptions = [
  'Unassigned',
  'Demo Dispatcher',
  'N. Gomez',
  'M. Carter',
  'K. Patel',
  'S. Tanaka',
] as const;

export const livePreviewException: ExceptionItem = {
  id: 'LIVE-ETA-20260819',
  title: 'Live ETA Slippage',
  category: 'Delay',
  domain: 'Shipments',
  severity: 'High',
  status: 'New',
  description: 'A subscribed ETA rule detected a projected delivery-window breach.',
  shipmentId: 'SHP-00009',
  timestamp: new Date().toISOString(),
  assignee: 'Unassigned',
};
