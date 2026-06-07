import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

jest.setTimeout(30000);

const TOOL = "selenium";
const SCENARIO = "checkout-flow";
const RESULTS_FILE = path.join(__dirname, "..", "results", "timings.csv");

function logTiming(run: number, durationMs: number): void {
  fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
  if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, "tool,scenario,run,duration_ms\n");
  }
  fs.appendFileSync(RESULTS_FILE, `${TOOL},${SCENARIO},${run},${durationMs}\n`);
}

describe("Selenium - checkout flow", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    const options = new chrome.Options();
    options.addArguments(
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080",
      "--disable-features=PasswordLeakDetection,PasswordManagerOnboarding,AutofillServerCommunication",
    );

    options.setUserPreferences({
      credentials_enable_service: false,
      "profile.password_manager_enabled": false,
      "profile.password_manager_leak_detection": false,
    });

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  for (let runNumber = 1; runNumber <= 11; runNumber++) {
    test(`run ${runNumber} - rondt de checkout succesvol af`, async () => {
      const startTime = Date.now();

      const loginPage = new LoginPage(driver);
      await loginPage.open();
      await loginPage.login("standard_user", "secret_sauce");

      const productsPage = new ProductsPage(driver);
      await productsPage.addProductToCart("sauce-labs-backpack");
      await productsPage.openCart();

      const cartPage = new CartPage(driver);
      await cartPage.checkout();

      const checkoutPage = new CheckoutPage(driver);
      await checkoutPage.fillInformation("Bryan", "Fouda", "9000");
      await checkoutPage.finish();

      expect(await checkoutPage.getConfirmationMessage()).toBe(
        "Thank you for your order!",
      );

      const duration = Date.now() - startTime;
      console.log(`Run ${runNumber}: ${duration} ms`);
      logTiming(runNumber, duration);
    });
  }
});
