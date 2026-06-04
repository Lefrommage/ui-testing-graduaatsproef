import { Builder, By, until, WebDriver } from "selenium-webdriver";
import "chromedriver";

// Succesvolle login
jest.setTimeout(30000);

describe("Selenium - succesvolle login", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.saucedemo.com/");
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("gebruiker kan succesvol inloggen", async () => {
    await driver
      .findElement(By.css('[data-test="username"]'))
      .sendKeys("standard_user");
    await driver
      .findElement(By.css('[data-test="password"]'))
      .sendKeys("secret_sauce");
    await driver.findElement(By.css('[data-test="login-button"]')).click();

    await driver.wait(until.urlContains("inventory.html"), 5000);

    const titleText = await driver.findElement(By.css(".title")).getText();

    expect(titleText).toBe("Products");
  });
});
