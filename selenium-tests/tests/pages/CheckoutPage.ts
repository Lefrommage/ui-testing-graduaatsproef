import { WebDriver, By } from "selenium-webdriver";

export class CheckoutPage {
  constructor(private readonly driver: WebDriver) {}

  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.driver
      .findElement(By.css('[data-test="firstName"]'))
      .sendKeys(firstName);
    await this.driver
      .findElement(By.css('[data-test="lastName"]'))
      .sendKeys(lastName);
    await this.driver
      .findElement(By.css('[data-test="postalCode"]'))
      .sendKeys(postalCode);
    await this.driver.findElement(By.css('[data-test="continue"]')).click();
  }

  async finish(): Promise<void> {
    await this.driver.findElement(By.css('[data-test="finish"]')).click();
  }

  async getConfirmationMessage(): Promise<string> {
    return this.driver.findElement(By.css(".complete-header")).getText();
  }
}
