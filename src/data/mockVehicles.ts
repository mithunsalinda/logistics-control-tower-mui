import type { RegionCode } from '../config/regions';

export type VehicleStatus = 'ACTIVE' | 'DELAYED' | 'WARNING' | 'IDLE';

export type TransportMode = 'ROAD' | 'RAIL' | 'AIR' | 'OCEAN';

export interface Vehicle {
  id: string;
  name: string;

  region: RegionCode;

  latitude: number;
  longitude: number;

  status: VehicleStatus;
  mode: TransportMode;

  speed: number;
  fuelLevel: number;

  driver: string;

  shipmentId: string;

  origin: string;
  destination: string;

  temperature: number;

  lastUpdated: string;
}

interface Hub {
  city: string;
  latitude: number;
  longitude: number;
}

/*
 * ==============================
 * EUROPE HUBS
 * ==============================
 */

const europeHubs: Hub[] = [
  {
    city: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    city: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    city: 'Berlin',
    latitude: 52.52,
    longitude: 13.405,
  },
  {
    city: 'Amsterdam',
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    city: 'Madrid',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    city: 'Rome',
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    city: 'Brussels',
    latitude: 50.8503,
    longitude: 4.3517,
  },
  {
    city: 'Vienna',
    latitude: 48.2082,
    longitude: 16.3738,
  },
  {
    city: 'Warsaw',
    latitude: 52.2297,
    longitude: 21.0122,
  },
  {
    city: 'Prague',
    latitude: 50.0755,
    longitude: 14.4378,
  },
];

/*
 * ==============================
 * NORTH AMERICA HUBS
 * ==============================
 */

const northAmericaHubs: Hub[] = [
  {
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    city: 'Los Angeles',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    city: 'Chicago',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  {
    city: 'Dallas',
    latitude: 32.7767,
    longitude: -96.797,
  },
  {
    city: 'Houston',
    latitude: 29.7604,
    longitude: -95.3698,
  },
  {
    city: 'Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    city: 'Vancouver',
    latitude: 49.2827,
    longitude: -123.1207,
  },
  {
    city: 'Atlanta',
    latitude: 33.749,
    longitude: -84.388,
  },
  {
    city: 'Miami',
    latitude: 25.7617,
    longitude: -80.1918,
  },
  {
    city: 'Mexico City',
    latitude: 19.4326,
    longitude: -99.1332,
  },
];

/*
 * ==============================
 * ASIA PACIFIC HUBS
 * ==============================
 */

const asiaPacificHubs: Hub[] = [
  {
    city: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
  },
  {
    city: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    city: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    city: 'Melbourne',
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    city: 'Colombo',
    latitude: 6.9271,
    longitude: 79.8612,
  },
  {
    city: 'Bangkok',
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    city: 'Hong Kong',
    latitude: 22.3193,
    longitude: 114.1694,
  },
  {
    city: 'Seoul',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    city: 'Mumbai',
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    city: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
  },
];

const drivers = [
  'James Wilson',
  'Michael Brown',
  'Daniel Anderson',
  'Robert Taylor',
  'David Miller',
  'John Smith',
  'Alex Martin',
  'Kevin White',
  'Ryan Jackson',
  'Chris Thomas',
  'Andrew Lewis',
  'Mark Walker',
  'Brian Hall',
  'Steven Young',
  'Eric King',
];

const statuses: VehicleStatus[] = [
  'ACTIVE',
  'ACTIVE',
  'ACTIVE',
  'ACTIVE',
  'ACTIVE',
  'ACTIVE',
  'DELAYED',
  'WARNING',
  'IDLE',
];

const modes: TransportMode[] = ['ROAD', 'ROAD', 'ROAD', 'ROAD', 'ROAD', 'RAIL', 'AIR', 'OCEAN'];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/*
 * Generate vehicles for one region.
 */
function generateVehicles(
  region: RegionCode,
  prefix: string,
  hubs: Hub[],
  totalVehicles: number,
): Vehicle[] {
  const result: Vehicle[] = [];

  for (let i = 1; i <= totalVehicles; i++) {
    const origin = randomItem(hubs);

    let destination = randomItem(hubs);

    /*
     * Make sure destination is different
     * from origin.
     */
    while (destination.city === origin.city) {
      destination = randomItem(hubs);
    }

    const status = randomItem(statuses);

    /*
     * Spread vehicles around the hub.
     *
     * This helps us test map clustering.
     */
    const latitudeOffset = (Math.random() - 0.5) * 2;

    const longitudeOffset = (Math.random() - 0.5) * 2;

    const vehicleNumber = i.toString().padStart(4, '0');

    result.push({
      id: `${prefix}-${vehicleNumber}`,

      name: `Vehicle ${prefix}-${vehicleNumber}`,

      region,

      latitude: origin.latitude + latitudeOffset,

      longitude: origin.longitude + longitudeOffset,

      status,

      mode: randomItem(modes),

      speed: status === 'IDLE' ? 0 : Math.floor(Math.random() * 80 + 10),

      fuelLevel: Math.floor(Math.random() * 80 + 20),

      driver: randomItem(drivers),

      shipmentId: `SHP-${prefix}-${vehicleNumber}`,

      origin: origin.city,

      destination: destination.city,

      temperature: Number((Math.random() * 15 + 10).toFixed(1)),

      lastUpdated: new Date().toISOString(),
    });
  }

  return result;
}

/*
 * ======================================
 * BUSINESS REQUIREMENT DATA
 * ======================================
 *
 * Europe         = 3,100
 * North America  = 2,900
 * Asia Pacific   = 2,500
 *
 * TOTAL          = 8,500
 */

const europeVehicles = generateVehicles('EUROPE', 'EU', europeHubs, 3100);

const northAmericaVehicles = generateVehicles('NORTH_AMERICA', 'NA', northAmericaHubs, 2900);

const asiaPacificVehicles = generateVehicles('ASIA_PACIFIC', 'AP', asiaPacificHubs, 2500);

export const vehicles: Vehicle[] = [
  ...europeVehicles,
  ...northAmericaVehicles,
  ...asiaPacificVehicles,
];
