import { WebDriver, By, until } from "selenium-webdriver";

export class LoginPage {
  private readonly url = "https://www.saucedemo.com/";

  constructor(private readonly driver: WebDriver) {}

  async open(): Promise<void> {
    await this.driver.get(this.url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.driver
      .findElement(By.css('[data-test="username"]'))
      .sendKeys(username);
    await this.driver
      .findElement(By.css('[data-test="password"]'))
      .sendKeys(password);
    await this.driver.findElement(By.css('[data-test="login-button"]')).click();
  }

  async isErrorVisible(): Promise<boolean> {
    const error = await this.driver.wait(
      until.elementLocated(By.css('[data-test="error"]')),
      5000,
    );
    return error.isDisplayed();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    const button = await this.driver.wait(
      until.elementLocated(By.css('[data-test="login-button"]')),
      5000,
    );
    return button.isDisplayed();
  }
}
