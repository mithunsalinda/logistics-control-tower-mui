import SearchRounded from '@mui/icons-material/SearchRounded';
import { Box } from '@mui/material';

import { formControlStyles } from './FormControls.styles';

interface SearchFieldProps {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

export default function SearchField({ onChange, placeholder, value }: SearchFieldProps) {
  return (
    <Box sx={formControlStyles.searchRoot}>
      <SearchRounded sx={formControlStyles.searchIcon} />
      <Box
        component="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        sx={formControlStyles.searchInput}
      />
    </Box>
  );
}
