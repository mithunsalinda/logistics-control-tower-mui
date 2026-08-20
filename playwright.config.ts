import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  fullyParallel: true,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node node_modules/json-server/lib/bin.js db.json --port 3002',
      url: 'http://127.0.0.1:3002',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
