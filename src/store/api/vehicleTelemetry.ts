import type { RegionCode } from '../../config/regions';

import { vehicles, type Vehicle } from './mockVehicles';

type FeatureCollection = {
  type: 'FeatureCollection';
  features: Array<Record<string, unknown>>;
};

export function getVehiclesByRegion(region: RegionCode): Vehicle[] {
  return vehicles.filter((vehicle) => vehicle.region === region);
}

export function getVehicleById(vehicleId: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.id === vehicleId);
}

function getTelemetryOffset(vehicle: Vehicle, tick: number) {
  const numericSeed = Number(vehicle.id.replace(/\D/g, '').slice(-4)) || 1;
  const drift = Math.min(vehicle.speed / 9000, 0.009);

  return {
    latitude: Math.sin((tick + numericSeed) / 4) * drift,
    longitude: Math.cos((tick + numericSeed) / 5) * drift,
  };
}

export function getLiveVehiclePosition(vehicle: Vehicle, tick: number) {
  const offset = getTelemetryOffset(vehicle, tick);

  return {
    latitude: vehicle.latitude + offset.latitude,
    longitude: vehicle.longitude + offset.longitude,
  };
}

export function getVehicleGeoJson(region: RegionCode, tick = 0): FeatureCollection {
  const regionVehicles = getVehiclesByRegion(region);

  return {
    type: 'FeatureCollection' as const,

    features: regionVehicles.map((vehicle) => {
      const position = getLiveVehiclePosition(vehicle, tick);

      return {
        type: 'Feature' as const,

        properties: {
          id: vehicle.id,
          name: vehicle.name,
          assetType: 'Vehicle + Shipment',
          status: vehicle.status,
          mode: vehicle.mode,
          speed: vehicle.speed,
          fuelLevel: vehicle.fuelLevel,
          driver: vehicle.driver,
          shipmentId: vehicle.shipmentId,
          origin: vehicle.origin,
          destination: vehicle.destination,
          temperature: vehicle.temperature,
          lastUpdated: new Date().toISOString(),
        },

        geometry: {
          type: 'Point' as const,
          coordinates: [position.longitude, position.latitude],
        },
      };
    }),
  };
}

export function getSelectedShipmentRouteGeoJson(vehicle: Vehicle, tick = 0): FeatureCollection {
  const livePosition = getLiveVehiclePosition(vehicle, tick);
  const plannedRoute = [
    [vehicle.originLongitude, vehicle.originLatitude],
    [vehicle.destinationLongitude, vehicle.destinationLatitude],
  ];
  const actualPath = [
    [vehicle.originLongitude, vehicle.originLatitude],
    [livePosition.longitude, livePosition.latitude],
  ];
  const nearestPlannedPoint = [
    (vehicle.originLongitude + vehicle.destinationLongitude) / 2,
    (vehicle.originLatitude + vehicle.destinationLatitude) / 2,
  ];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          kind: 'planned',
          label: 'Planned route',
        },
        geometry: {
          type: 'LineString',
          coordinates: plannedRoute,
        },
      },
      {
        type: 'Feature',
        properties: {
          kind: 'actual',
          label: 'Actual path',
        },
        geometry: {
          type: 'LineString',
          coordinates: actualPath,
        },
      },
      {
        type: 'Feature',
        properties: {
          kind: 'deviation',
          label: 'Route deviation',
        },
        geometry: {
          type: 'LineString',
          coordinates: [[livePosition.longitude, livePosition.latitude], nearestPlannedPoint],
        },
      },
    ],
  };
}

function squarePolygon(longitude: number, latitude: number, size: number) {
  return [
    [
      [longitude - size, latitude - size],
      [longitude + size, latitude - size],
      [longitude + size, latitude + size],
      [longitude - size, latitude + size],
      [longitude - size, latitude - size],
    ],
  ];
}

export function getGeofenceGeoJson(region: RegionCode): FeatureCollection {
  const hubs = getVehiclesByRegion(region).slice(0, 8);

  return {
    type: 'FeatureCollection',
    features: hubs.map((vehicle, index) => ({
      type: 'Feature',
      properties: {
        id: `GEO-${vehicle.origin}-${index}`,
        name: `${vehicle.origin} facility perimeter`,
        eventState: index % 3 === 0 ? 'Entry/exit event' : 'Normal',
      },
      geometry: {
        type: 'Polygon',
        coordinates: squarePolygon(vehicle.originLongitude, vehicle.originLatitude, 0.35),
      },
    })),
  };
}

export function getExceptionHeatGeoJson(region: RegionCode): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: getVehiclesByRegion(region)
      .filter((vehicle) => vehicle.status === 'DELAYED' || vehicle.status === 'WARNING')
      .slice(0, 80)
      .map((vehicle) => ({
        type: 'Feature',
        properties: {
          intensity: vehicle.status === 'WARNING' ? 0.9 : 0.65,
        },
        geometry: {
          type: 'Point',
          coordinates: [vehicle.longitude, vehicle.latitude],
        },
      })),
  };
}

export function getWarehouseCapacityGeoJson(region: RegionCode): FeatureCollection {
  const seenHubs = new Set<string>();
  const facilities = getVehiclesByRegion(region).filter((vehicle) => {
    if (seenHubs.has(vehicle.origin)) {
      return false;
    }

    seenHubs.add(vehicle.origin);
    return true;
  });

  return {
    type: 'FeatureCollection',
    features: facilities.slice(0, 10).map((vehicle, index) => ({
      type: 'Feature',
      properties: {
        name: vehicle.origin,
        capacity: 55 + ((index * 11) % 42),
      },
      geometry: {
        type: 'Point',
        coordinates: [vehicle.originLongitude, vehicle.originLatitude],
      },
    })),
  };
}

export function getWeatherGeoJson(region: RegionCode): FeatureCollection {
  const centerVehicle = getVehiclesByRegion(region)[0];

  if (!centerVehicle) {
    return { type: 'FeatureCollection', features: [] };
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          condition: 'Weather watch corridor',
        },
        geometry: {
          type: 'Polygon',
          coordinates: squarePolygon(centerVehicle.longitude, centerVehicle.latitude, 4.5),
        },
      },
    ],
  };
}

export function getTrafficGeoJson(region: RegionCode): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: getVehiclesByRegion(region)
      .slice(0, 18)
      .map((vehicle) => ({
        type: 'Feature',
        properties: {
          congestion: vehicle.status === 'DELAYED' ? 'Heavy' : 'Moderate',
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [vehicle.originLongitude, vehicle.originLatitude],
            [vehicle.destinationLongitude, vehicle.destinationLatitude],
          ],
        },
      })),
  };
}
