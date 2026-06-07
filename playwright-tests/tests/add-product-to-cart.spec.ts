import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

test("product toevoegen aan winkelmand", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  const productsPage = new ProductsPage(page);
  await productsPage.addProductToCart("sauce-labs-backpack");

  await expect(productsPage.cartBadge).toHaveText("1");
});
