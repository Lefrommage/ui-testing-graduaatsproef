import { Builder, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { LoginPage } from "./pages/LoginPage";

jest.setTimeout(30000);

describe("Selenium - foutieve login", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("toont een foutmelding bij verkeerde login", async () => {
    const loginPage = new LoginPage(driver);
    await loginPage.open();
    await loginPage.login("wrong_user", "wrong_password");

    expect(await loginPage.isErrorVisible()).toBe(true);
  });
});
