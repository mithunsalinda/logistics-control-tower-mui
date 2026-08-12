export type RegionCode = 'EUROPE' | 'NORTH_AMERICA' | 'ASIA_PACIFIC';

export interface RegionConfig {
  id: RegionCode;
  name: string;
  center: [number, number];
  zoom: number;
}

export const REGIONS: Record<RegionCode, RegionConfig> = {
  EUROPE: {
    id: 'EUROPE',
    name: 'Europe',
    center: [10, 50],
    zoom: 3,
  },

  NORTH_AMERICA: {
    id: 'NORTH_AMERICA',
    name: 'North America',
    center: [-100, 45],
    zoom: 3,
  },

  ASIA_PACIFIC: {
    id: 'ASIA_PACIFIC',
    name: 'Asia Pacific',
    center: [115, 15],
    zoom: 2.5,
  },
};
