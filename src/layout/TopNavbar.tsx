import { useState, type ReactNode } from 'react';

import {
  DarkModeOutlined,
  KeyboardArrowDownRounded,
  LogoutRounded,
  NotificationsNoneRounded,
  PersonOutlineRounded,
  SearchRounded,
} from '@mui/icons-material';

import {
  Badge,
  Box,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';

const regions = ['Europe', 'North America', 'Asia Pacific'];

export default function TopNavbar() {
  const [region, setRegion] = useState('Europe');

  const handleRegionChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
  };

  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        //minHeight: 100,
        boxSizing: 'border-box',
        backgroundColor: '#f4f8fc',
        borderTop: '1px solid #d8e2ec',
        px: {
          xs: 1,
          sm: 1.5,
          md: 1.75,
        },
        py: 1.45,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: {
            xs: 1.5,
            lg: 1.5,
          },
          flexWrap: {
            xs: 'wrap',
            lg: 'nowrap',
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: {
              xs: '100%',
              lg: 400,
            },
            height: 36,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #d4e0eb',
            borderRadius: '10px',
            px: 2,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
            '&:focus-within': {
              borderColor: '#8da9c2',
            },
          }}
        >
          <SearchRounded
            sx={{
              flexShrink: 0,
              color: '#152941',
              fontSize: 16,
            }}
          />
          <Box
            sx={{
              width: '1px',
              height: 30,
              mx: 1.5,
              backgroundColor: '#cbd7e2',
            }}
          />
          <InputBase
            fullWidth
            placeholder="Search shipment, order, asset or facility..."
            inputProps={{
              'aria-label': 'Search shipment, order, asset or facility',
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              color: '#1b2d44',
              fontSize: {
                xs: 10,
                md: 14,
              },
              '& input': {
                p: 0,
              },
              '& input::placeholder': {
                color: '#677a91',
                opacity: 1,
              },
            }}
          />

          <Box
            sx={{
              flexShrink: 0,
              height: 27,
              minWidth: 52,
              ml: 1.5,
              px: 0.8,
              display: {
                xs: 'none',
                sm: 'flex',
              },
              alignItems: 'center',
              justifyContent: 'center',

              border: '1px solid #d8e2eb',
              borderRadius: '10px',

              backgroundColor: '#f0f5f8',
            }}
          >
            <Typography
              component="span"
              sx={{
                color: '#73869c',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              ⌘ K
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: {
              xs: '100%',
              sm: 207,
            },
            height: 36,
            flexShrink: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #d4e0eb',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <Select
            fullWidth
            value={region}
            onChange={handleRegionChange}
            IconComponent={KeyboardArrowDownRounded}
            inputProps={{
              'aria-label': 'Select region',
            }}
            sx={{
              height: '100%',
              color: '#081d38',
              fontSize: 14,
              fontWeight: 500,
              '& .MuiSelect-select': {
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                px: 2.4,
                py: 0,
              },
              '& fieldset': {
                border: 'none',
              },
              '& .MuiSelect-icon': {
                right: 13,
                color: '#182c42',
                fontSize: 25,
              },
            }}
          >
            {regions.map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{
                  fontSize: 14,
                }}
              >
                {item}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
            ml: {
              xs: 0,
              lg: 0,
            },
          }}
        >
          <ActionButton ariaLabel="Toggle dark mode" icon={<DarkModeOutlined />} />
          <Badge
            badgeContent={4}
            color="error"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                minWidth: 23,
                height: 23,
                px: 0.6,
                borderRadius: '50%',
                top: 6,
                right: 6,
                backgroundColor: '#ff6676',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                border: '2px solid #f4f8fc',
              },
            }}
          >
            <ActionButton ariaLabel="Notifications" icon={<NotificationsNoneRounded />} />
          </Badge>
          <Box
            sx={{
              width: '1px',
              height: 48,
              mx: 0.2,
              backgroundColor: '#dce5ed',
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          />
          <Box
            sx={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 1.4,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: '10px',
                backgroundColor: '#dceff0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#009d98',
              }}
            >
              <PersonOutlineRounded
                sx={{
                  fontSize: 18,
                }}
              />
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },

                minWidth: 96,
              }}
            >
              <Typography
                sx={{
                  color: '#18293f',
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                Dispatcher
              </Typography>
              <Typography
                sx={{
                  mt: 0.2,
                  color: '#6a7e97',
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                Dispatcher
              </Typography>
            </Box>
            <IconButton
              aria-label="Logout"
              sx={{
                width: 16,
                height: 16,
                color: '#63758c',
                '&:hover': {
                  color: '#0b223e',
                  backgroundColor: '#e8eff5',
                },
                '& svg': {
                  fontSize: 18,
                },
              }}
            >
              <LogoutRounded />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface ActionButtonProps {
  icon: ReactNode;
  ariaLabel: string;
}

function ActionButton({ icon, ariaLabel }: ActionButtonProps) {
  return (
    <IconButton
      aria-label={ariaLabel}
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: '10px',
        border: '1px solid #d4e0eb',
        backgroundColor: '#ffffff',
        color: '#152941',
        '&:hover': {
          backgroundColor: '#f7fafc',
          borderColor: '#becddc',
        },
        '& svg': {
          fontSize: 16,
        },
      }}
    >
      {icon}
    </IconButton>
  );
}
