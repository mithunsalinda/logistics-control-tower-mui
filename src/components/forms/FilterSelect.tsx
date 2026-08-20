import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

import { formControlStyles } from './FormControls.styles';

interface FilterSelectProps<T extends string> {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
}

export default function FilterSelect<T extends string>({
  label,
  onChange,
  options,
  value,
}: FilterSelectProps<T>) {
  return (
    <Box sx={formControlStyles.selectShell}>
      <Select
        value={value}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value as T)}
        IconComponent={KeyboardArrowDownRounded}
        displayEmpty
        sx={formControlStyles.select}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option === 'All' ? `${label}: All` : option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
