import { Builder, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

jest.setTimeout(30000);

describe("Selenium - checkout flow", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("rondt de checkout succesvol af", async () => {
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");

    const productsPage = new ProductsPage(driver);
    await productsPage.addProductToCart("sauce-labs-backpack");
    await productsPage.openCart();

    const cartPage = new CartPage(driver);
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(driver);
    await checkoutPage.fillInformation("Bryan", "Fouda", "9000");
    await checkoutPage.finish();

    expect(await checkoutPage.getConfirmationMessage()).toBe(
      "Thank you for your order!",
    );
  });
});
