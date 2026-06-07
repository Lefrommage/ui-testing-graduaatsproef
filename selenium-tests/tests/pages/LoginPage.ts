import { WebDriver, By, until, WebElement } from "selenium-webdriver";

export class LoginPage {
  private readonly url = "https://www.saucedemo.com/";

  constructor(private readonly driver: WebDriver) {}

  private async waitAndFind(selector: string): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      5000,
    );
    await this.driver.wait(until.elementIsVisible(element), 5000);
    return element;
  }

  async open(): Promise<void> {
    await this.driver.get(this.url);
  }

  async login(username: string, password: string): Promise<void> {
    await (await this.waitAndFind('[data-test="username"]')).sendKeys(username);
    await (await this.waitAndFind('[data-test="password"]')).sendKeys(password);
    await (await this.waitAndFind('[data-test="login-button"]')).click();
  }

  async isErrorVisible(): Promise<boolean> {
    const error = await this.waitAndFind('[data-test="error"]');
    return error.isDisplayed();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    const button = await this.waitAndFind('[data-test="login-button"]');
    return button.isDisplayed();
  }
}
