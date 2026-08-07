import { Box, Paper, Stack, Typography } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { Button, InputBox } from '../components';
import { loginUser } from '../utils/auth';

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must contain at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Later replace this with your real login API.
    loginUser();

    navigate('/dashboard', {
      replace: true,
    });
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f4f7fb 0%, #e8eef8 100%)',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          maxWidth: 430,
          padding: {
            xs: 3,
            sm: 4,
          },
          width: '100%',
        }}
      >
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography color="primary" variant="h5">
            Logistics Control Tower
          </Typography>

          <Typography component="h1" variant="h4">
            Welcome Back
          </Typography>

          <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
            Enter your account details to continue
          </Typography>
        </Stack>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <InputBox
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email}
              inputVariant="primary"
              label="Email Address"
              onChange={(event) => {
                setEmail(event.target.value);

                setErrors((currentErrors) => ({
                  ...currentErrors,
                  email: undefined,
                }));
              }}
              required
              type="email"
              value={email}
            />

            <InputBox
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password}
              inputVariant="outlined"
              label="Password"
              onChange={(event) => {
                setPassword(event.target.value);

                setErrors((currentErrors) => ({
                  ...currentErrors,
                  password: undefined,
                }));
              }}
              required
              type="password"
              value={password}
            />

            <Button customVariant="primary" fullWidth type="submit">
              Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
