import { WebDriver, By, until, WebElement } from "selenium-webdriver";

export class ProductsPage {
  constructor(private readonly driver: WebDriver) {}

  private async waitAndFind(selector: string): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      5000,
    );
    await this.driver.wait(until.elementIsVisible(element), 5000);
    return element;
  }

  async waitUntilLoaded(): Promise<void> {
    await this.driver.wait(until.urlContains("inventory.html"), 5000);
    await this.waitAndFind(".title");
  }

  async getTitle(): Promise<string> {
    const title = await this.waitAndFind(".title");
    return title.getText();
  }

  // productId bv. "sauce-labs-backpack"
  async addProductToCart(productId: string): Promise<void> {
    await (
      await this.waitAndFind(`[data-test="add-to-cart-${productId}"]`)
    ).click();
  }

  async getCartCount(): Promise<string> {
    const badge = await this.waitAndFind(".shopping_cart_badge");
    return badge.getText();
  }

  async openCart(): Promise<void> {
    await (await this.waitAndFind(".shopping_cart_link")).click();
  }

  async logout(): Promise<void> {
    // Open het zijmenu
    await (await this.waitAndFind("#react-burger-menu-btn")).click();
    // Wacht tot de logoutlink zichtbaar is (na de menu-animatie) en klik
    const logoutButton = await this.waitAndFind(
      '[data-test="logout-sidebar-link"]',
    );
    await this.driver.wait(until.elementIsEnabled(logoutButton), 5000);
    await logoutButton.click();
  }
}
