import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

test("checkout flow succesvol afronden", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  const productsPage = new ProductsPage(page);
  await productsPage.addProductToCart("sauce-labs-backpack");
  await productsPage.openCart();

  const cartPage = new CartPage(page);
  await cartPage.checkout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInformation("Bryan", "Fouda", "9000");
  await checkoutPage.finish();

  await expect(checkoutPage.completeHeader).toHaveText(
    "Thank you for your order!",
  );
});
