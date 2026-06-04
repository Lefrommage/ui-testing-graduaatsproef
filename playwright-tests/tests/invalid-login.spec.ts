import { test, expect } from "@playwright/test";

// invalid login
test("foutieve login toont foutmelding", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.locator('[data-test="username"]').fill("wrong_user");
  await page.locator('[data-test="password"]').fill("wrong_password");
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});
