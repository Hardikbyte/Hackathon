const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: 'tests',
  timeout: 120000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'node server.js',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
})