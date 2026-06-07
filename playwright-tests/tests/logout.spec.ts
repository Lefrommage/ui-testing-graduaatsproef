import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

test("logout brengt gebruiker terug naar loginpagina", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  const productsPage = new ProductsPage(page);
  await productsPage.logout();

  await expect(loginPage.loginButton).toBeVisible();
});
