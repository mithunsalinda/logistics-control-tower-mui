import { KeyboardArrowDownRounded } from '@mui/icons-material';
import {
  Box,
  MenuItem,
  Select,
  type SelectChangeEvent,
  type SxProps,
  type Theme,
} from '@mui/material';

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function BaseSelect({
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  sx,
}: BaseSelectProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <Box
      sx={{
        minWidth: { xs: '100%', sm: 100 },
        height: 38,
        borderRadius: '10px',
        border: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-surface)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        disabled={disabled}
        IconComponent={KeyboardArrowDownRounded}
        renderValue={(selected) => {
          if (!selected && placeholder) {
            return placeholder;
          }
          const selectedOption = options.find((option) => option.value === selected);
          return selectedOption?.label ?? selected;
        }}
        sx={[
          {
            width: '100%',
            height: '100%',
            color: 'var(--app-text)',
            fontSize: 14,
            fontWeight: 500,
            '& .MuiSelect-select': {
              px: 1.5,
              py: 0,
              display: 'flex',
              alignItems: 'center',
            },
            '& fieldset': {
              border: 'none',
            },
            '& .MuiSelect-icon': {
              color: 'var(--app-text)',
              right: 10,
              fontSize: 18,
            },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
