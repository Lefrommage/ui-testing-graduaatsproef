import { Builder, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

jest.setTimeout(30000);

describe("Selenium - product toevoegen aan winkelmand", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("voegt een product toe aan de winkelmand", async () => {
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");

    const productsPage = new ProductsPage(driver);
    await productsPage.addProductToCart("sauce-labs-backpack");

    expect(await productsPage.getCartCount()).toBe("1");
  });
});
