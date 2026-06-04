import { test, expect } from "@playwright/test";
import { login } from "./helpers/loginHelper";

// logout
test("logout brengt gebruiker terug naar loginpagina", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page);

  await page.locator("#react-burger-menu-btn").click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});
