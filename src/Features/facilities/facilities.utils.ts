import type { Facility, FacilityEvent, YardAppointment } from '../../store';

export function getFilteredFacilities({
  facilities,
  region,
  searchText,
}: {
  facilities: Facility[];
  region: string;
  searchText: string;
}) {
  const query = searchText.trim().toLowerCase();

  return facilities.filter((facility) => {
    const searchable = [
      facility.code,
      facility.name,
      facility.status,
      facility.staffing,
      facility.events.map((event) => event.type).join(' '),
    ]
      .join(' ')
      .toLowerCase();

    return facility.region === region && (query.length === 0 || searchable.includes(query));
  });
}

export function getSelectedFacility(facilities: Facility[], selectedFacilityId: string) {
  return facilities.find((facility) => facility.id === selectedFacilityId) ?? facilities[0];
}

export function getFacilitySummary(facilities: Facility[]) {
  return {
    affectedShipments: facilities.reduce((total, facility) => total + facility.affectedShipments, 0),
    constrainedFacilities: facilities.filter((facility) => facility.status === 'Constrained').length,
    totalAppointments: facilities.reduce((total, facility) => total + facility.appointments.length, 0),
    totalEvents: facilities.reduce((total, facility) => total + facility.events.length, 0),
  };
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getUtilizationColor(value: number) {
  if (value >= 85) {
    return '#d74d4d';
  }

  if (value >= 75) {
    return '#d66b29';
  }

  return '#159d95';
}

export function getStatusColor(status: Facility['status']) {
  return status === 'Constrained'
    ? { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' }
    : { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
}

export function getSeverityColor(severity: FacilityEvent['severity']) {
  switch (severity) {
    case 'Critical':
      return { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'High':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    case 'Medium':
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
    default:
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
  }
}

export function getYardStatusColor(status: YardAppointment['yardStatus']) {
  switch (status) {
    case 'Late':
      return { bg: '#fff0f0', border: '#ffc4c4', main: '#d74d4d', text: '#a22727' };
    case 'In Yard':
    case 'At Door':
      return { bg: '#fff0dc', border: '#ffd39a', main: '#d66b29', text: '#9a4e0a' };
    case 'Departed':
      return { bg: '#e7f7ef', border: '#bce6cf', main: '#2f8f6b', text: '#237155' };
    default:
      return { bg: '#eef4ff', border: '#cadbff', main: '#4b68cf', text: '#334ca6' };
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
