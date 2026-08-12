import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

import { REGIONS, type RegionCode } from '../../config/regions';

interface RegionSelectorProps {
  region: RegionCode;
  onChange: (region: RegionCode) => void;
}

export default function RegionSelector({ region, onChange }: RegionSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const selectedRegion = event.target.value as RegionCode;

    console.log('Selected region:', selectedRegion);

    onChange(selectedRegion);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: 220,
      }}
    >
      <InputLabel id="region-select-label">Region</InputLabel>

      <Select labelId="region-select-label" value={region} label="Region" onChange={handleChange}>
        {Object.values(REGIONS).map((regionItem) => (
          <MenuItem key={regionItem.id} value={regionItem.id}>
            {regionItem.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
