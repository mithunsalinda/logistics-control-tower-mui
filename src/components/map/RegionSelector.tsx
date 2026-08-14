import { FormControl } from '@mui/material';

import { REGIONS, type RegionCode } from '../../config/regions';
import BaseSelect, { type SelectOption } from '../BaseSelect';

interface RegionSelectorProps {
  region: RegionCode;
  onChange: (region: RegionCode) => void;
}

export default function RegionSelector({ region, onChange }: RegionSelectorProps) {
  const regionOptions: SelectOption[] = Object.values(REGIONS).map((regionItem) => ({
    label: regionItem.name,
    value: regionItem.id,
  }));

  const handleChange = (value: string) => {
    const selectedRegion = value as RegionCode;
    console.log('Selected region:', selectedRegion);
    onChange(selectedRegion);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: 220,
        height: 36,
      }}
    >
      <BaseSelect value={region} options={regionOptions} onChange={handleChange} />
    </FormControl>
  );
}
