import type { RegionCode } from '../config/regions';

import { vehicles, type Vehicle } from '../data/mockVehicles';

/*
 * Return vehicles only for selected region.
 */
export function getVehiclesByRegion(region: RegionCode): Vehicle[] {
  return vehicles.filter((vehicle) => vehicle.region === region);
}

/*
 * Convert our vehicle objects
 * into GeoJSON for MapLibre.
 */
export function getVehicleGeoJson(region: RegionCode) {
  const regionVehicles = getVehiclesByRegion(region);

  return {
    type: 'FeatureCollection' as const,

    features: regionVehicles.map((vehicle) => ({
      type: 'Feature' as const,

      properties: {
        id: vehicle.id,
        name: vehicle.name,
        status: vehicle.status,
        mode: vehicle.mode,
        speed: vehicle.speed,
        fuelLevel: vehicle.fuelLevel,
        driver: vehicle.driver,
        shipmentId: vehicle.shipmentId,
        origin: vehicle.origin,
        destination: vehicle.destination,
        temperature: vehicle.temperature,
        lastUpdated: vehicle.lastUpdated,
      },

      geometry: {
        type: 'Point' as const,
        coordinates: [vehicle.longitude, vehicle.latitude],
      },
    })),
  };
}
