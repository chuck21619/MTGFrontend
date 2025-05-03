import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000', // or wherever your frontend runs
    headless: true,
    ignoreHTTPSErrors: true,
  },
});
