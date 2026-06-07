import { WebDriver, By, until, WebElement } from "selenium-webdriver";

export class CartPage {
  constructor(private readonly driver: WebDriver) {}

  private async waitAndFind(selector: string): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      5000,
    );
    await this.driver.wait(until.elementIsVisible(element), 5000);
    return element;
  }

  async checkout(): Promise<void> {
    await (await this.waitAndFind('[data-test="checkout"]')).click();
  }
}
