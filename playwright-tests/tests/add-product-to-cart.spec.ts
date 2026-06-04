import { test, expect } from "@playwright/test";
import { login } from "./helpers/loginHelper";

// add product to cart
test("product toevoegen aan winkelmand", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
