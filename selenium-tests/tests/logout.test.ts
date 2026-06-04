import { Builder, By, until, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { login } from "./helpers/loginHelper";

jest.setTimeout(30000);

describe("Selenium - logout", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.saucedemo.com/");
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("brengt gebruiker terug naar loginpagina na logout", async () => {
    await login(driver);

    await driver.findElement(By.css("#react-burger-menu-btn")).click();

    const logoutButton = await driver.wait(
      until.elementLocated(By.css('[data-test="logout-sidebar-link"]')),
      5000,
    );

    await logoutButton.click();

    const loginButton = await driver.wait(
      until.elementLocated(By.css('[data-test="login-button"]')),
      5000,
    );

    const isLoginButtonVisible = await loginButton.isDisplayed();

    expect(isLoginButtonVisible).toBe(true);
  });
});
