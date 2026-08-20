import { ArrowForwardRounded, WarningAmberRounded } from '@mui/icons-material';

import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import { useGetExceptionsQuery } from '../store';

type Priority = 'Low' | 'Medium' | 'High';

const priorityStyles: Record<
  Priority,
  {
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  Low: {
    color: '#45e3b1',
    background: 'rgba(33, 201, 151, 0.10)',
    border: 'rgba(33, 201, 151, 0.28)',
    accent: '#31d5cc',
  },

  Medium: {
    color: '#ffd166',
    background: 'rgba(255, 209, 102, 0.10)',
    border: 'rgba(255, 209, 102, 0.30)',
    accent: '#ffd166',
  },

  High: {
    color: '#ffb341',
    background: 'rgba(255, 179, 65, 0.10)',
    border: 'rgba(255, 179, 65, 0.30)',
    accent: '#ffb341',
  },
};

export default function ActiveExceptions() {
  const { data: exceptions = [] } = useGetExceptionsQuery();
  const activeExceptions = exceptions.filter((item) => item.status !== 'Resolved').slice(0, 4);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 470,
        boxSizing: 'border-box',
        backgroundColor: '#FFF',
        border: '1px solid #eeeaea',
        borderRadius: '24px',
        p: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#2ce0d6',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            Priority Queue
          </Typography>

          <Typography
            sx={{
              color: '#303030',
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Active Exceptions
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={0.3}
          sx={{
            alignItems: 'center',
            color: '#2ce0d6',
            cursor: 'pointer',

            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            View all
          </Typography>

          <IconButton
            size="small"
            sx={{
              color: '#2ce0d6',
              p: 0.5,
            }}
          >
            <ArrowForwardRounded />
          </IconButton>
        </Stack>
      </Stack>

      <Stack spacing={1.5}>
        {activeExceptions.map((item) => {
          const priorityLabel: Priority = item.severity === 'Critical' ? 'High' : item.severity;
          const priority = priorityStyles[priorityLabel];
          const eventTime = new Intl.DateTimeFormat('en', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(item.timestamp));

          return (
            <Box
              key={item.id}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: 95,
                backgroundColor: '#f5f5f5',
                border: '1px solid #263f57',
                borderRadius: '14px',
                transition:
                  'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',

                '&:hover': {
                  backgroundColor: '#f4f4f4',
                  borderColor: '#3a5b78',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: 5,
                  backgroundColor: priority.accent,
                }}
              />

              <Stack
                direction="row"
                spacing={1.7}
                sx={{
                  p: 2,
                  pl: 1.8,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    borderRadius: '11px',
                    backgroundColor: 'rgba(255, 179, 64, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WarningAmberRounded
                    sx={{
                      color: '#ffad33',
                      fontSize: 25,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#303030',
                        fontSize: 12,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Chip
                      label={priorityLabel}
                      size="small"
                      sx={{
                        flexShrink: 0,
                        height: 31,
                        color: priority.color,
                        backgroundColor: priority.background,
                        border: `1px solid ${priority.border}`,
                        fontSize: 10,
                        fontWeight: 700,

                        '& .MuiChip-label': {
                          px: 1.2,
                        },
                      }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      color: '#88a8cc',
                      fontSize: 10,
                      mt: 0.1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#7ea2cb',
                      fontSize: 10,
                      mt: 0.3,
                    }}
                  >
                    {item.shipmentId} - {eventTime}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
