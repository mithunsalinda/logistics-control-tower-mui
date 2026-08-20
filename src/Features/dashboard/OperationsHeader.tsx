import { Box, Typography } from '@mui/material';

interface OperationsHeaderProps {
  region?: string;
  liveUpdate?: boolean;
  pageName?: string;
  title?: string;
  desc?: string;
}

export default function OperationsHeader({
  region = 'Europe',
  pageName,
  liveUpdate,
  desc,
  title,
}: OperationsHeaderProps) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          justifyContent: 'space-between',
          alignItems: {
            xs: 'flex-start',
            md: 'flex-end',
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#009e99',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: '#0e0f0f',
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: '2.5px',
              mb: 0.5,
            }}
          >
            {pageName}
          </Typography>
          <Typography
            sx={{
              color: '#647b99',

              fontSize: {
                xs: 10,
                sm: 10,
                md: 14,
              },

              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            {desc}
          </Typography>
        </Box>
        {liveUpdate && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pb: {
                xs: 0,
                md: 0.5,
              },
              whiteSpace: 'nowrap',
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#d9f5eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#48d39a',
                }}
              />
            </Box>

            <Typography
              sx={{
                color: '#657a96',
                fontSize: 12,
                fontWeight: 400,
              }}
            >
            Updated just now
            {region ? ` - ${region}` : ''}
          </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
