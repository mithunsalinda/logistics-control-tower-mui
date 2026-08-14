import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  selectedPath: string;
  onNavigate: (path: string) => void;
}

const NavigationMenu = ({ items, selectedPath, onNavigate }: NavigationMenuProps) => (
  <List
    sx={{
      px: 1.5,
      py: 2,
    }}
  >
    {items.map((item) => {
      const isSelected = selectedPath === item.path;

      return (
        <ListItemButton
          key={item.path}
          onClick={() => onNavigate(item.path)}
          selected={isSelected}
          sx={{
            borderRadius: 2,
            mb: 0.75,
            minHeight: 38,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',

              '&:hover': {
                backgroundColor: 'primary.dark',
              },

              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={<Typography sx={{ fontSize: '0.75rem' }}>{item.label}</Typography>}
          />
        </ListItemButton>
      );
    })}
  </List>
);

export default NavigationMenu;
