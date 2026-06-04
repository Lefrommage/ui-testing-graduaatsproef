import { test, expect } from "@playwright/test";
import { login } from "./helpers/loginHelper";

test("checkout flow succesvol afronden", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator(".shopping_cart_link").click();

  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill("Bryan");
  await page.locator('[data-test="lastName"]').fill("Fouda");
  await page.locator('[data-test="postalCode"]').fill("9000");
  await page.locator('[data-test="continue"]').click();

  await page.locator('[data-test="finish"]').click();

  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
});
