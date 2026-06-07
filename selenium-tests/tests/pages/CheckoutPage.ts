import { WebDriver, By, until, WebElement } from "selenium-webdriver";

export class CheckoutPage {
  constructor(private readonly driver: WebDriver) {}

  private async waitAndFind(selector: string): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      5000,
    );
    await this.driver.wait(until.elementIsVisible(element), 5000);
    return element;
  }

  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await (
      await this.waitAndFind('[data-test="firstName"]')
    ).sendKeys(firstName);
    await (await this.waitAndFind('[data-test="lastName"]')).sendKeys(lastName);
    await (
      await this.waitAndFind('[data-test="postalCode"]')
    ).sendKeys(postalCode);
    await (await this.waitAndFind('[data-test="continue"]')).click();
  }

  async finish(): Promise<void> {
    await (await this.waitAndFind('[data-test="finish"]')).click();
  }

  async getConfirmationMessage(): Promise<string> {
    const header = await this.waitAndFind(".complete-header");
    return header.getText();
  }
}
