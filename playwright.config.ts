import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./packages/ui-desktop/tests",
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
