import { test, expect } from "@playwright/test";

// successful-login
test("succesvolle login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator(".title")).toHaveText("Products");
});
