import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

test("succesvolle login", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  const productsPage = new ProductsPage(page);
  await expect(page).toHaveURL(/inventory.html/);
  await expect(productsPage.title).toHaveText("Products");
});
