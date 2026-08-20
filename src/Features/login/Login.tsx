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

import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';

import { Button } from '../../components';
import { setCredentials, useAppDispatch, useLoginMutation } from '../../store';

import { loginStyles } from './Login.styles';
import { useTranslation } from 'react-i18next';
type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('auth');
  const [loginError, setLoginError] = useState('');
  const [loginUser, { isLoading }] = useLoginMutation();
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

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setLoginError('');

    try {
      const response = await loginUser({
        email,
        password,
      }).unwrap();

      dispatch(setCredentials(response.user));
      const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Invalid email or password');
    }
  };

  return (
    <Box sx={loginStyles.root}>
      <Box sx={loginStyles.heroSection}>
        <Stack direction="row" spacing={1} sx={loginStyles.logoContainer}>
          <BusinessIcon color="primary" />
          <Typography sx={loginStyles.logoText}>NEXUS CONTROL TOWER</Typography>
        </Stack>

        <Box sx={loginStyles.heroContent}>
          <Typography variant="overline" sx={loginStyles.eyebrow}>
            REAL-TIME SUPPLY CHAIN OPERATIONS
          </Typography>
          <Typography sx={loginStyles.title}>{t('bannertext')}</Typography>
          <Typography sx={loginStyles.description}>{t('bannerbn')}</Typography>
        </Box>
      </Box>
      <Box sx={loginStyles.formSection}>
        <Card component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={loginStyles.card}>
          <CardContent sx={loginStyles.cardContent}>
            <Stack direction="row" spacing={1.5} sx={loginStyles.cardHeader}>
              <Avatar variant="rounded" sx={loginStyles.avatar}>
                <LockIcon />
              </Avatar>

              <Typography variant="h1" sx={loginStyles.signInTitle}>
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
              {loginError && <Alert severity="error">{loginError}</Alert>}
              <Button type="submit" customVariant="primary" size="large" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in to Control Tower'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
