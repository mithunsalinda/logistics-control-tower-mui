import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';

import type { RegionCode } from '../../config/regions';
import { useGetFacilitiesQuery } from '../../store';
import { getDataRegion } from '../../utils/regionFilters';
import {
  getFacilitySummary,
  getFilteredFacilities,
  getSelectedFacility,
} from './facilities.utils';

export function useFacilitiesController() {
  const { region } = useOutletContext<{ region: RegionCode }>();
  const selectedDataRegion = getDataRegion(region);
  const { data: facilities = [], isFetching } = useGetFacilitiesQuery();
  const [searchText, setSearchText] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  const regionFacilities = useMemo(
    () =>
      getFilteredFacilities({
        facilities,
        region: selectedDataRegion,
        searchText,
      }),
    [facilities, searchText, selectedDataRegion],
  );

  useEffect(() => {
    setSelectedFacilityId(regionFacilities[0]?.id ?? '');
  }, [regionFacilities]);

  const selectedFacility = getSelectedFacility(regionFacilities, selectedFacilityId);
  const summary = getFacilitySummary(regionFacilities);

  return {
    isFetching,
    regionFacilities,
    searchText,
    selectedDataRegion,
    selectedFacility,
    selectedFacilityId,
    setSearchText,
    setSelectedFacilityId,
    summary,
  };
}
