import { test, expect } from "@playwright/test";

test("standard user can login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
});
