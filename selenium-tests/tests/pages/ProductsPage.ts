import { WebDriver, By, until } from "selenium-webdriver";

export class ProductsPage {
  constructor(private readonly driver: WebDriver) {}

  async waitUntilLoaded(): Promise<void> {
    await this.driver.wait(until.urlContains("inventory.html"), 5000);
  }

  async getTitle(): Promise<string> {
    return this.driver.findElement(By.css(".title")).getText();
  }

  // productId bv. "sauce-labs-backpack"
  async addProductToCart(productId: string): Promise<void> {
    await this.driver
      .findElement(By.css(`[data-test="add-to-cart-${productId}"]`))
      .click();
  }

  async getCartCount(): Promise<string> {
    return this.driver.findElement(By.css(".shopping_cart_badge")).getText();
  }

  async openCart(): Promise<void> {
    await this.driver.findElement(By.css(".shopping_cart_link")).click();
  }

  async logout(): Promise<void> {
    await this.driver.findElement(By.css("#react-burger-menu-btn")).click();
    const logoutButton = await this.driver.wait(
      until.elementLocated(By.css('[data-test="logout-sidebar-link"]')),
      5000,
    );
    await logoutButton.click();
  }
}
