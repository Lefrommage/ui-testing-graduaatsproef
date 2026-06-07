import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "./pages/LoginPage";

jest.setTimeout(30000);

const TOOL = "selenium";
const SCENARIO = "invalid-login";
const RESULTS_FILE = path.join(__dirname, "..", "results", "timings.csv");

function logTiming(run: number, durationMs: number): void {
  fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
  if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, "tool,scenario,run,duration_ms\n");
  }
  fs.appendFileSync(RESULTS_FILE, `${TOOL},${SCENARIO},${run},${durationMs}\n`);
}

describe("Selenium - foutieve login", () => {
  let driver: WebDriver;

  beforeEach(async () => {
    const options = new chrome.Options();
    options.addArguments(
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080",
    );
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
    test(`run ${runNumber} - toont een foutmelding bij verkeerde login`, async () => {
      const startTime = Date.now();

      const loginPage = new LoginPage(driver);
      await loginPage.open();
      await loginPage.login("wrong_user", "wrong_password");

      expect(await loginPage.isErrorVisible()).toBe(true);

      const duration = Date.now() - startTime;
      console.log(`Run ${runNumber}: ${duration} ms`);
      logTiming(runNumber, duration);
    });
  }
});
