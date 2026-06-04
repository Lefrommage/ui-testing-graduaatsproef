import { Builder, By, until, WebDriver } from "selenium-webdriver";
import "chromedriver";

jest.setTimeout(30000);

describe("Selenium - foutieve login", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.saucedemo.com/");
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("toont een foutmelding bij verkeerde login", async () => {
    await driver
      .findElement(By.css('[data-test="username"]'))
      .sendKeys("wrong_user");
    await driver
      .findElement(By.css('[data-test="password"]'))
      .sendKeys("wrong_password");
    await driver.findElement(By.css('[data-test="login-button"]')).click();

    const errorElement = await driver.wait(
      until.elementLocated(By.css('[data-test="error"]')),
      5000,
    );

    const isErrorVisible = await errorElement.isDisplayed();

    expect(isErrorVisible).toBe(true);
  });
});
