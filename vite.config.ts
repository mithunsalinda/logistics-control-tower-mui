import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 70,
        functions: 75,
      },
      exclude: [
        'dist/**',
        'coverage/**',
        'playwright.config.ts',
        'e2e/**',
        'src/test/**',
        '**/*.styles.ts',
        '**/*.types.ts',
        '**/*.d.ts',
        'src/store/api/**',
        'src/store/index.ts',
        'src/store/rootReducer.ts',
      ],
    },
  },
});
