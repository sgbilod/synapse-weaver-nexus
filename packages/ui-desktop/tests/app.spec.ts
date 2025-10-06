import { test, expect } from "@playwright/test";

test.describe("ui-desktop smoke test", () => {
  test("placeholder verification", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page).toHaveTitle(/Example Domain/);
  });
});
