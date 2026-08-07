import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '../components';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = ({ email, password }: LoginFormValues) => {
    setLoginError('');

    if (email !== 'admin@gmail.com' || password !== 'password123') {
      setLoginError('Invalid email or password');
      return;
    }

    dispatch(login({ email }));
    navigate('/dashboard', {
      replace: true,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1.35fr .75fr' },
        bgcolor: '#06111e',
        backgroundImage:
          'radial-gradient(circle at 15% 15%, rgba(55,213,197,.18), transparent 28%), radial-gradient(circle at 82% 75%, rgba(47,117,255,.18), transparent 32%)',
      }}
    >
      <Box
        sx={{
          minHeight: { xs: 320, lg: '100vh' },
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, md: 5 },
          color: '#eff8ff',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <BusinessIcon color="primary" />
          <Typography sx={{ fontWeight: 900, letterSpacing: '0.12em' }}>
            NEXUS CONTROL TOWER
          </Typography>
        </Stack>
        <Box
          sx={{
            position: { xs: 'relative', lg: 'absolute' },
            left: { lg: '9%' },
            top: { lg: '34%' },
            mt: { xs: 8, lg: 0 },
            maxWidth: 720,
            zIndex: 2,
          }}
        >
          <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: '0.16em' }}>
            REAL-TIME SUPPLY CHAIN OPERATIONS
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '3rem', md: '5rem', xl: '6.5rem' },
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.065em',
              mt: 1.5,
            }}
          >
            See disruption.
            <br />
            Decide faster.
          </Typography>
          <Typography
            sx={{
              maxWidth: 520,
              mt: 3,
              color: 'rgba(232,244,255,.68)',
              fontSize: '1.05rem',
              lineHeight: 1.65,
            }}
          >
            A unified operational cockpit for shipments, fleet, facilities and exceptions.
          </Typography>
        </Box>
        {Array.from({ length: 22 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${(index * 41) % 92}%`,
              top: `${(index * 29) % 82}%`,
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              boxShadow: '0 0 18px #37d5c5',
              opacity: 0.7,
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2.5, md: 4 } }}>
        <Card
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: '100%', maxWidth: 430 }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 }, '&:last-child': { pb: { xs: 3, md: 4 } } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Avatar
                variant="rounded"
                sx={{ bgcolor: 'action.selected', color: 'primary.main', mb: 2 }}
              >
                <LockIcon />
              </Avatar>
              <Typography variant="h1" sx={{ fontSize: '1.65rem', mb: 4 }}>
                Sign In
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    // RFC-like simple validation: single '@', a domain and a TLD
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: 'Enter a valid email address (e.g. user@example.com)',
                  },
                })}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must contain at least 6 characters',
                  },
                })}
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Keep me signed in on this device"
              />
              {loginError ? <Alert severity="error">{loginError}</Alert> : null}
              <Button type="submit" customVariant="primary" size="large">
                Sign in to Control Tower
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
