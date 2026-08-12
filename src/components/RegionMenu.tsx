import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { RegionCode } from '../config/regions';

const menuId = 'region-menu';
const buttonId = 'region-menu-button';

const regionOptions = [
  { label: 'North America', value: 'NORTH_AMERICA' as const },
  { label: 'Europe', value: 'EUROPE' as const },
  { label: 'Asia Pacific', value: 'ASIA_PACIFIC' as const },
];

interface Props {
  region: RegionCode;
  onChange: (region: RegionCode) => void;
}

const RegionMenu = ({ region, onChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selected: RegionCode) => {
    onChange(selected);
    handleClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    }
  };

  const selectedLabel =
    regionOptions.find((option) => option.value === region)?.label ?? 'Select region';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Box
        component="span"
        id={buttonId}
        role="button"
        tabIndex={0}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={{
          cursor: 'pointer',
          px: 2,
          py: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          fontWeight: 500,
          minWidth: 140,
          textAlign: 'center',
        }}
      >
        {selectedLabel}
      </Box>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': buttonId,
          },
        }}
      >
        {regionOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={region === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default RegionMenu;
