import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { Button, InputBox } from "../components";

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginSuccess(false);

    if (!validateForm()) {
      return;
    }

    const loginData = {
      email,
      password,
      rememberMe,
    };

    // Replace this with your login API call.
    // await loginApi(loginData);

    console.log("Login data:", loginData);
    setLoginSuccess(true);
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          maxWidth: 420,
          padding: {
            xs: 3,
            sm: 4,
          },
          width: "100%",
        }}
      >
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, textAlign: "center" }}
          >
            Welcome Back
          </Typography>

          <Typography color="text.secondary" align="center">
            Sign in to continue to your account
          </Typography>
        </Stack>

        {loginSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Login successful
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <InputBox
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email}
              inputVariant="primary"
              label="Email Address"
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({
                  ...current,
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
                setErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
              }}
              required
              type="password"
              value={password}
            />

            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                }
                label="Remember me"
              />

              <Link href="/forgot-password" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            <Button customVariant="primary" fullWidth type="submit">
              Loginq
            </Button>

            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ textAlign: "center" }}
            >
              Don&apos;t have an account?{" "}
              <Link href="/register" underline="hover">
                Create account
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
