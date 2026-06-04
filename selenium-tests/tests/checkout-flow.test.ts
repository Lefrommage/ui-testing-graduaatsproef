import { Builder, By, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { login } from "./helpers/loginHelper";

jest.setTimeout(30000);

describe("Selenium - checkout flow", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.saucedemo.com/");
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("rondt de checkout succesvol af", async () => {
    await login(driver);

    await driver
      .findElement(By.css('[data-test="add-to-cart-sauce-labs-backpack"]'))
      .click();
    await driver.findElement(By.css(".shopping_cart_link")).click();

    await driver.findElement(By.css('[data-test="checkout"]')).click();
    await driver
      .findElement(By.css('[data-test="firstName"]'))
      .sendKeys("Bryan");
    await driver
      .findElement(By.css('[data-test="lastName"]'))
      .sendKeys("Fouda");
    await driver
      .findElement(By.css('[data-test="postalCode"]'))
      .sendKeys("9000");
    await driver.findElement(By.css('[data-test="continue"]')).click();

    await driver.findElement(By.css('[data-test="finish"]')).click();

    const completeHeaderText = await driver
      .findElement(By.css(".complete-header"))
      .getText();

    expect(completeHeaderText).toBe("Thank you for your order!");
  });
});
