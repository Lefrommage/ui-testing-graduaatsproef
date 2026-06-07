import { WebDriver, By } from "selenium-webdriver";

export class CartPage {
  constructor(private readonly driver: WebDriver) {}

  async checkout(): Promise<void> {
    await this.driver.findElement(By.css('[data-test="checkout"]')).click();
  }
}
