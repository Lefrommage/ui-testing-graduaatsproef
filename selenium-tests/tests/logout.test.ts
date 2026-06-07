import { Builder, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

jest.setTimeout(30000);

describe("Selenium - logout", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("brengt gebruiker terug naar loginpagina na logout", async () => {
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");

    const productsPage = new ProductsPage(driver);
    await productsPage.logout();

    expect(await loginPage.isLoginButtonVisible()).toBe(true);
  });
});
