import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://frontend:5173',
    headless: true,
    ignoreHTTPSErrors: true,
  },
});
