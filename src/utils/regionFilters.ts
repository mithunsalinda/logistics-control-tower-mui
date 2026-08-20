import type { RegionCode } from '../config/regions';

export type DataRegion = 'Europe' | 'APAC' | 'Americas';

export const dataRegionByCode: Record<RegionCode, DataRegion> = {
  EUROPE: 'Europe',
  NORTH_AMERICA: 'Americas',
  ASIA_PACIFIC: 'APAC',
};

export function getDataRegion(region: RegionCode): DataRegion {
  return dataRegionByCode[region];
}
