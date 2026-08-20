import type { ExceptionItem, ExceptionSeverity, ExceptionStatus } from '../../store';

import { severityRank, type ExceptionStatusFilter } from './exceptions.constants';

export function getExceptionQueue({
  exceptions,
  livePreviewVisible,
  searchTerm,
  statusFilter,
  previewException,
}: {
  exceptions: ExceptionItem[];
  livePreviewVisible: boolean;
  previewException: ExceptionItem;
  searchTerm: string;
  statusFilter: ExceptionStatusFilter;
}) {
  const visibleExceptions = livePreviewVisible ? [previewException, ...exceptions] : exceptions;
  const query = searchTerm.trim().toLowerCase();

  return visibleExceptions
    .filter((exception) => {
      const searchable = [
        exception.id,
        exception.title,
        exception.description,
        exception.shipmentId,
        exception.category,
        exception.domain,
        exception.assignee,
      ]
        .join(' ')
        .toLowerCase();

      const activeMatch =
        statusFilter === 'Active'
          ? exception.status !== 'Resolved'
          : statusFilter === 'All' || exception.status === statusFilter;

      return activeMatch && (query.length === 0 || searchable.includes(query));
    })
    .sort((left, right) => {
      const severityDelta = severityRank[right.severity] - severityRank[left.severity];

      if (severityDelta !== 0) {
        return severityDelta;
      }

      return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
    });
}

export function getCriticalNewExceptions(queue: ExceptionItem[]) {
  return queue.filter((exception) => exception.severity === 'Critical' && exception.status === 'New');
}

export function isPreviewException(exception: ExceptionItem) {
  return exception.id.startsWith('LIVE-');
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getSeverityColor(severity: ExceptionSeverity) {
  switch (severity) {
    case 'Critical':
      return { bg: '#fff0f0', border: '#ffb5b5', main: '#d32f2f', text: '#8f1d1d' };
    case 'High':
      return { bg: '#fff5e7', border: '#ffd29a', main: '#d66b29', text: '#9a4e0a' };
    case 'Medium':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    default:
      return { bg: '#e9f7f4', border: '#b9e4da', main: '#159d95', text: '#0c6863' };
  }
}

export function getStatusColor(status: ExceptionStatus) {
  switch (status) {
    case 'Resolved':
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
    case 'In Progress':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    case 'Acknowledged':
      return { bg: '#fff5e7', border: '#ffd29a', main: '#d66b29', text: '#9a4e0a' };
    default:
      return { bg: '#fff0f0', border: '#ffb5b5', main: '#d32f2f', text: '#8f1d1d' };
  }
}

export function chipSx(color: { bg: string; border: string; text: string }) {
  return {
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontSize: 11,
    fontWeight: 900,
    height: 24,
  };
}

export const tonePalette = {
  amber: { bg: '#fff8ed', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' },
  blue: { bg: '#f2f7ff', border: '#c9daf5', main: '#4b68cf', text: '#263f98' },
  green: { bg: '#effaf5', border: '#bce6cf', main: '#2f8f6b', text: '#237155' },
  red: { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' },
};
