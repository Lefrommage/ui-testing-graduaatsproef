import { Builder, By, WebDriver } from "selenium-webdriver";
import "chromedriver";
import { login } from "./helpers/loginHelper";

jest.setTimeout(30000);

describe("Selenium - product toevoegen aan winkelmand", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.saucedemo.com/");
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("voegt een product toe aan de winkelmand", async () => {
    await login(driver);

    await driver
      .findElement(By.css('[data-test="add-to-cart-sauce-labs-backpack"]'))
      .click();

    const cartBadgeText = await driver
      .findElement(By.css(".shopping_cart_badge"))
      .getText();

    expect(cartBadgeText).toBe("1");
  });
});
